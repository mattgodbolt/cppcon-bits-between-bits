#include <iostream>
#include "message.h"

void greet() {
	std::cout << getMessage() << "\n";
}
int main() {
	greet();
}
