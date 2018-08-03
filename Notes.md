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


makefiles...bulid stuff
* show objdump -D -x --full-contents ...
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
- google filename? dl-init.c, find it?
- see how that works
- 

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
