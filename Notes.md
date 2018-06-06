When you run your C++ code, have you ever considered how the  linker, loader, operating system, C and C++ runtime all work so hard to get everything set up for you to start running your code in main()?

In this Linux-focused talk, Matt will talk about how the linker stitches together your code and how that fits in with dynamic linking. He'll touch on debugging issues with the loader, and how ODR violations can manifest themselves. Then he'll take a look at what's going on behind the scenes to get the C runtime up, and then the C++ runtime, along with all the global object constructors - showing more reasons why you shouldn't be using them!

By the end of the talk you should have an understanding of how a bundle of object files are brought together by the linker, along with the relevant runtimes, and then loaded and executed by the operating system.

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
  - Debugging it, LD_DEBUG (also LD_PRELOAD)
  - ODR violations
- Global constructors
  - special sections for these
  - how they work
- Single stepping to main() ? run callgrind to see how many instructions get run?
- War stories (if time)
  - exceptions thrown across SO boundaries
  - other ODR violations if I remember...
- Using linker scripts/sections for fun and profit? (out of band metadata?)
