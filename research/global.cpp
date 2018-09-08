#include <iostream>

int i;
struct Global {
  Global() { 
    i++; 
  }
};

Global global;

int main() {
  std::cout << "i = " << i << "\n";
}
