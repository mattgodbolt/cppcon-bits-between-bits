all: research snippets

.PHONY: all research snippets

research:
	$(MAKE) -C research


snippets: research
	mkdir -p snippets
	objdump --no-show-raw-insn -dC research/out/empty/c++/none/dynamic/empty > snippets/empty-objdump
