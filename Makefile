all: research snippets

.PHONY: all research snippets

research:
	$(MAKE) -C research

snippets: research Makefile
	mkdir -p snippets
	readelf -a research/out/empty/c++/none/dynamic/empty > snippets/empty-readelf
	objdump --no-show-raw-insn -dC research/out/empty/c++/none/dynamic/empty > snippets/empty-objdump
	objdump -dC research/out/hello/c++/none/dynamic/hello.o > snippets/hello-o-objdump
	objdump --no-show-raw-insn --reloc -dC research/out/hello/c++/none/dynamic/hello.o > snippets/hello-o-objdump-reloc
	readelf --sections research/out/empty/c++/none/dynamic/empty > snippets/empty-readelf-sections
	g++ -o /dev/null research/empty.cpp -Wl,--verbose > snippets/linker-script 2>&1
	readelf --dynamic --program-headers research/out/hello/c++/none/dynamic-dso/hello | sed 's/0x00000000/0x/g; s|out/hello/c++/none/dynamic-dso/||g' > snippets/readelf-d-dynamic-hello
	objdump --syms -C research/out/hello/c++/none/dynamic/hello.o | grep -v debug | sed 's/\b00000000//g' > snippets/hello-o-syms
	objdump --syms -C research/out/hello/c++/none/dynamic/message.o | grep -v debug | sed 's/\b00000000//g' > snippets/message-o-syms

clean:
	rm -rf snippets
	$(MAKE) -C research clean
