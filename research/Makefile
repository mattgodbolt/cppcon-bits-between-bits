CC:=/opt/compiler-explorer/gcc-8.1.0/bin/gcc
CXX:=/opt/compiler-explorer/gcc-8.1.0/bin/g++
CFLAGS=-Os -g
CXXFLAGS=-Os -g

all: out/hello_c out/hello_cpp out/hello_c_static out/hello_cpp_static

out/hello_c.o: hello_c.c Makefile
	mkdir -p out
	$(CC) -c -o $@ $< $(CFLAGS)

out/hello_c: out/hello_c.o
out/hello_cpp: hello_cpp.cpp Makefile
	mkdir -p out
	$(CXX) -o $@ $< $(CFLAGS)

out/hello_c_static: hello_c.c Makefile
	mkdir -p out
	$(CC) -o $@ $< $(CFLAGS) -static
out/hello_cpp_static: hello_cpp.cpp Makefile
	mkdir -p out
	$(CXX) -o $@ $< $(CFLAGS) -static

.PHONY: clean static

clean:
	rm -rf out/
