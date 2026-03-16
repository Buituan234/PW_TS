//bản thiết kế ko hoàn chỉnh
abstract class Vehicle {
  protected brand: string;

  constructor(brand: string) {
    this.brand = brand;
  }
  //phương thức chung
  startEngine() {
    console.log(`Dong co cua ${this.brand} da khoi dong`);
  }
  // 1 phương thức trừu tượng (chì có tên, ko có code)
  // chúng ta bắt buộc mọi lớp con phải tự định nghĩa
  //xem nó di chuyển như thế nào
  abstract move(): void;
}

class Car extends Vehicle {
  move() {
    console.log(`chiec xe ${this.brand} dang chay tren 4 banh`);
  }
}

class Truck extends Vehicle {
  move() {
    console.log(`chiec xe tai ${this.brand} dang chay tren 18 banh`);
  }
}
//ko thể khởi tạo 1 instance của abstract class
// const vehilce = new Vehicle();
const myCar = new Car('Toyota');
const myTruck = new Truck('Huyndai');

myCar.startEngine();
myCar.move();

myTruck.startEngine();
myTruck.move();

// trong TS có 1 hàm gọi là parameters<T>