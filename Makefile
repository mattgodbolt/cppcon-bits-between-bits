all: research snippets

.PHONY: all research snippets

research:
	$(MAKE) -C research

snippets: research Makefile
	mkdir -p snippets
	objdump --no-show-raw-insn -dC research/out/empty/c++/none/dynamic/empty > snippets/empty-objdump
	readelf --sections research/out/empty/c++/none/dynamic/empty > snippets/empty-readelf-sections

clean:
	rm -rf snippets
	$(MAKE) -C research clean
