#include <iostream>

int i = 0;
struct Global {
	Global() { i = 1; };
};

Global global;

int main() {
	std::cout << "i = " << i << "\n";
}
