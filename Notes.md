The bits between the bits
--------------------

When you run your C++ code, have you ever considered how the  linker, loader, operating system, C and C++ runtime all 
work so hard to get everything set up for you to start running your code in main()?

In this Linux-focused talk, Matt will talk about how the linker stitches together your code and how that fits in with 
dynamic linking. He'll touch on debugging issues with the loader, and how ODR violations can manifest themselves. Then 
he'll take a look at what's going on behind the scenes to get the C runtime up, and then the C++ runtime, along with 
all the global object constructors - showing more reasons why you shouldn't be using them!

By the end of the talk you should have an understanding of how a bundle of object files are brought together by the 
linker, along with the relevant runtimes, and then loaded and executed by the operating system.

- Simple example program (Static/non-static linking)
  - Why is it so large?
  - What's in it?
- .o files and .a files
  - Diversion to LTO?
- the linker
  - ld, gold
  - finding the command-line GCC/clang is using to invoke linker
  - system libraries (libc, libgcc etc)
  - linker sections (-ffunction-sections, -fdata-sections, --gc-sections?)
  - linker scripts
- Dynamic linking
  - rough overview
- ELF format 101
- Dynamic library loading process
  - Debugging it, `LD_DEBUG` (also `LD_PRELOAD`)
  - ODR violations
- Global constructors
  - special sections for these
  - how they work
- Single stepping to main() ? run callgrind to see how many instructions get run?
- War stories (if time)
  - exceptions thrown across SO boundaries
  - other ODR violations if I remember...
- Using linker scripts/sections for fun and profit? (out of band metadata?)

## What do I want to teach?

- Static and global initialisation is fraught with troubles. Explain and demonstrate why.
- Intuition on how LTO works and how it might find new ODR violations you didn't know about.
- Bonus: some diea how the OS loads and runs your program
- Bonus: something linker scripts?


## Raw notes
makefiles...bulid stuff
* show objdump -D -x --full-contents ...
* readelf -d ... shows `INIT` and `FINI` addresses amongst other things (dynamic)
  * readelf -a shows `.init` even in static, section name
  * also: entry point address 0x400a90 yay, which corresponds to `_start`
* follow 'interp' to find ld thingy
* maybe .init?
* gdb, break on `_init`
```
  (gdb) bt
#0  _init (argc=1, argv=0x7fffffffdf88, envp=0x7fffffffdf98) at ../csu/init-first.c:52
#1  0x00007ffff7de56ec in call_init (env=0x7fffffffdf98, argv=0x7fffffffdf88, argc=1, l=0x7ffff7fce000) at dl-init.c:58
#2  _dl_init (main_map=0x7ffff7ffe170, argc=1, argv=0x7fffffffdf88, env=0x7fffffffdf98) at dl-init.c:119
#3  0x00007ffff7dd60ca in _dl_start_user () from /lib64/ld-linux-x86-64.so.2
```
-- ooh that's the loader thing, `_dl_start_user`, eh? I recognise that from the sections...
- google filename? dl-init.c, find it? it's part of glibc's elf handling
- see how that works?
- interestingly if you break on _init() in a static it's different 
```
#0  0x00000000004004a8 in _init ()
#1  0x0000000000493b40 in __libc_csu_init ()
#2  0x0000000000493327 in __libc_start_main ()
#3  0x0000000000402d4a in _start ()

```
Make Global::Global() and get:
```
6	Global global;
(gdb) bt
#0  __static_initialization_and_destruction_0 (__initialize_p=1, __priority=65535) at hello_cpp.cpp:6
#1  _GLOBAL__sub_I_i () at hello_cpp.cpp:9
#2  0x000000000040075d in __libc_csu_init ()
#3  0x00007ffff70c1b28 in __libc_start_main (main=0x4005e0 <main()>, argc=1, argv=0x7fffffffdf88, init=0x400710 <__libc_csu_init>, 
    fini=<optimized out>, rtld_fini=<optimized out>, stack_end=0x7fffffffdf78) at ../csu/libc-start.c:266
```

in a static program we get:
```
(gdb) bt
#0  __static_initialization_and_destruction_0 (__initialize_p=1, __priority=65535) at hello_cpp.cpp:6
#1  _GLOBAL__sub_I_i () at hello_cpp.cpp:9
#2  0x0000000000493b5c in __libc_csu_init ()
#3  0x0000000000493327 in __libc_start_main ()
#4  0x0000000000402d4a in _start ()

```

- Separate thread, found crti.o
```
$ objdump -d crti.o 

crti.o:     file format elf64-x86-64


Disassembly of section .init:

0000000000000000 <_init>:
   0:	48 83 ec 08          	sub    $0x8,%rsp
   4:	48 8b 05 00 00 00 00 	mov    0x0(%rip),%rax        # b <_init+0xb>
   b:	48 85 c0             	test   %rax,%rax
   e:	74 02                	je     12 <_init+0x12>
  10:	ff d0                	callq  *%rax

Disassembly of section .fini:

0000000000000000 <_fini>:
   0:	48 83 ec 08          	sub    $0x8,%rsp
``` 

Some `.so` files are actually linker scripts!
```
$ cat /usr/lib/x86_64-linux-gnu/libc.so
/* GNU ld script
   Use the shared library, but some functions are only in
   the static library, so try that secondarily.  */
OUTPUT_FORMAT(elf64-x86-64)
GROUP ( /lib/x86_64-linux-gnu/libc.so.6 /usr/lib/x86_64-linux-gnu/libc_nonshared.a  AS_NEEDED ( /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 ) )
```

Hunting script files: compiled with -v then reran `collect2` with `--verbose`. Then realised compiling with
`-Wl,--verbose` did the trick. Finally get to see the linker script. Found of note:

* Very different if static vs dynanic. below is for dynamic
- `ENTRY(_start)`, `.interp`, `plt` tables, `.init_array` and `.fini_array`. Also ... `preinit_array` - news to me!
  - interesting separate `.ctors`
- Thread-local storage collected
- We note the hot, unlikely etc code carefully placed.
- Need to work out the `rela` stuff.
  - Dynamic load relative address?
- Files opened in order: `crt1.o`, `crti.o` (in libc), `crtbegin.o` (in compiler code) (`crtbeginT.o` for static)
  - latter provides `deregister_tm_clones` et al
- crtn.o at the end

```
Breakpoint 1, 0x0000000000402d90 in register_tm_clones ()
(gdb) bt
#0  0x0000000000402d90 in register_tm_clones ()
#1  0x0000000000493b5c in __libc_csu_init ()
#2  0x0000000000493327 in __libc_start_main ()
#3  0x0000000000402d4a in _start ()
```

- Google says that's transactional memory support! Neat...I guess...

- Version scripts?!