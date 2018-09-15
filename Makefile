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

clean:
	rm -rf snippets
	$(MAKE) -C research clean
