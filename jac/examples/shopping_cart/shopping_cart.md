# Shopping Cart: Object Spatial Programming Example

This example demonstrates how Jac's Object Spatial Programming (OSP) paradigm elegantly solves the classic "Shopping Cart Problem" and the broader Expression Problem through spatial separation of data and behavior.

## The Expression Problem

The Expression Problem is a fundamental challenge in programming language design:

> *How can we add both new types and new operations to a program without modifying existing code, while maintaining type safety and modularity?*

Traditional approaches have inherent limitations:
- **Object-Oriented Programming**: Easy to add new types, difficult to add new operations
- **Functional Programming**: Easy to add new operations, difficult to add new types

## Traditional OOP Challenges

Consider a typical shopping cart implementation with multiple item types requiring various operations:

```python
# Traditional Python approach
class Item:
    def calculate_shipping(self):
        raise NotImplementedError
    
    def calculate_tax(self):
        raise NotImplementedError
    
    def generate_packing_slip(self):
        raise NotImplementedError

class Book(Item):
    def calculate_shipping(self):
        return 5.0
    
    def calculate_tax(self):
        return 0.0  # Books are tax-free
    
    def generate_packing_slip(self):
        return f"Book - ISBN: {self.isbn}"

# Adding a new operation requires modifying ALL classes
# Adding a new type requires implementing ALL operations
```

### Problems with Traditional Approach

1. **Violation of Open/Closed Principle**: Adding operations requires modifying existing classes
2. **Scattered Logic**: Related operations are distributed across multiple classes
3. **Tight Coupling**: Data structure changes affect all operations
4. **Maintenance Burden**: Every new item type must implement every operation

## Jac's Spatial Solution

Jac solves these problems through Object Spatial Programming, which separates data structure from behavioral operations using spatial relationships.

### Core Architecture

```jac
# Data structure definition (main.jac)
agent Item {
    has name: str;
    has price: float;
    has weight: float;
}

agent Book: Item {
    has isbn: str;
    has author: str;
    has pages: int;
}

agent Electronics: Item {
    has brand: str;
    has warranty_months: int;
    has is_fragile: bool = True;
}

agent Clothing: Item {
    has size: str;
    has material: str;
    has color: str;
}

agent ShoppingCart {
    has items: list[Item] = [];
    has customer_id: str;
}
```

### Behavioral Operations (main.impl.jac)

Operations are implemented as walkers that traverse and operate on the spatial structure:

#### Shipping Cost Calculation

```jac
walker ShippingCalculator {
    has total_shipping: float = 0.0;
    
    can calculate with `Book entry {
        # Books have flat shipping rate
        self.total_shipping += 5.0;
    }
    
    can calculate with `Electronics entry {
        # Electronics shipping based on weight and fragility
        base_cost = here.weight * 0.5;
        fragile_fee = 10.0 if here.is_fragile else 0.0;
        self.total_shipping += base_cost + fragile_fee;
    }
    
    can calculate with `Clothing entry {
        # Clothing shipping based on weight
        self.total_shipping += here.weight * 0.75;
    }
}
```

#### Tax Calculation

```jac
walker TaxCalculator {
    has total_tax: float = 0.0;
    
    can calculate with `Book entry {
        # Books are tax-exempt
        self.total_tax += 0.0;
    }
    
    can calculate with `Electronics entry {
        # Electronics have 6% sales tax
        self.total_tax += here.price * 0.06;
    }
    
    can calculate with `Clothing entry {
        # Clothing has 8% sales tax
        self.total_tax += here.price * 0.08;
    }
}
```

#### Packing Slip Generation

```jac
walker PackingSlipGenerator {
    has packing_instructions: list[str] = [];
    
    can generate with `Book entry {
        instruction = f"Book: {here.name} (ISBN: {here.isbn})";
        instruction += f" - Standard packaging";
        self.packing_instructions.append(instruction);
    }
    
    can generate with `Electronics entry {
        instruction = f"Electronics: {here.name} ({here.brand})";
        if here.is_fragile {
            instruction += " - FRAGILE: Handle with care";
        }
        instruction += f" - Warranty: {here.warranty_months} months";
        self.packing_instructions.append(instruction);
    }
    
    can generate with `Clothing entry {
        instruction = f"Clothing: {here.name}";
        instruction += f" - Size: {here.size}, Color: {here.color}";
        instruction += f" - Material: {here.material}";
        self.packing_instructions.append(instruction);
    }
}
```

### Usage Example

```jac
with entry {
    # Create shopping cart
    cart = ShoppingCart(customer_id="CUST001");
    
    # Add items to cart
    book = Book(
        name="Clean Code",
        price=35.99,
        weight=1.2,
        isbn="978-0132350884",
        author="Robert Martin",
        pages=464
    );
    
    laptop = Electronics(
        name="MacBook Pro",
        price=1999.99,
        weight=4.2,
        brand="Apple",
        warranty_months=12,
        is_fragile=True
    );
    
    shirt = Clothing(
        name="Cotton T-Shirt",
        price=19.99,
        weight=0.3,
        size="M",
        material="Cotton",
        color="Blue"
    );
    
    cart.items = [book, laptop, shirt];
    
    # Calculate shipping costs
    shipping_calc = ShippingCalculator();
    for item in cart.items {
        shipping_calc.visit(item);
    }
    
    # Calculate taxes
    tax_calc = TaxCalculator();
    for item in cart.items {
        tax_calc.visit(item);
    }
    
    # Generate packing slips
    packing_gen = PackingSlipGenerator();
    for item in cart.items {
        packing_gen.visit(item);
    }
    
    # Display results
    subtotal = sum(item.price for item in cart.items);
    total = subtotal + shipping_calc.total_shipping + tax_calc.total_tax;
    
    print(f"Subtotal: ${subtotal:.2f}");
    print(f"Shipping: ${shipping_calc.total_shipping:.2f}");
    print(f"Tax: ${tax_calc.total_tax:.2f}");
    print(f"Total: ${total:.2f}");
    
    print("\nPacking Instructions:");
    for instruction in packing_gen.packing_instructions {
        print(f"- {instruction}");
    }
}
```

## Adding New Operations

Adding a discount calculator requires no changes to existing code:

```jac
walker DiscountCalculator {
    has total_discount: float = 0.0;
    has membership_level: str = "standard";
    
    can calculate with `Book entry {
        # Books get 10% discount for premium members
        if self.membership_level == "premium" {
            self.total_discount += here.price * 0.10;
        }
    }
    
    can calculate with `Electronics entry {
        # Electronics get volume discount
        base_discount = here.price * 0.05;
        if here.price > 1000 {
            base_discount += here.price * 0.02;  # Additional 2%
        }
        self.total_discount += base_discount;
    }
    
    can calculate with `Clothing entry {
        # Clothing gets seasonal discount
        seasonal_discount = here.price * 0.15;
        self.total_discount += seasonal_discount;
    }
}
```

## Adding New Item Types

Adding a new `DigitalDownload` type requires no changes to existing walkers:

```jac
agent DigitalDownload: Item {
    has file_size_mb: float;
    has download_url: str;
    has license_type: str;
}

# Extend existing walkers for the new type
walker ShippingCalculator {
    # ...existing code...
    
    can calculate with `DigitalDownload entry {
        # Digital downloads have no shipping cost
        self.total_shipping += 0.0;
    }
}

walker TaxCalculator {
    # ...existing code...
    
    can calculate with `DigitalDownload entry {
        # Digital products have 3% digital tax
        self.total_tax += here.price * 0.03;
    }
}

walker PackingSlipGenerator {
    # ...existing code...
    
    can generate with `DigitalDownload entry {
        instruction = f"Digital Download: {here.name}";
        instruction += f" - Size: {here.file_size_mb}MB";
        instruction += f" - License: {here.license_type}";
        instruction += f" - Download URL will be sent via email";
        self.packing_instructions.append(instruction);
    }
}
```

## Benefits of the Spatial Approach

### Modularity and Separation of Concerns

1. **Data Structure Independence**: Item agents contain only data, no behavior
2. **Operation Encapsulation**: Each walker encapsulates a single concern
3. **Loose Coupling**: Operations don't depend on item implementations

### Extensibility

1. **Easy Operation Addition**: New walkers don't affect existing code
2. **Simple Type Extension**: New item types integrate seamlessly
3. **Flexible Composition**: Mix and match operations as needed

### Maintainability

1. **Centralized Logic**: Related operations are grouped together
2. **Clear Responsibilities**: Each component has a single, clear purpose
3. **Type Safety**: Compile-time checking ensures correctness

## Comparison with Traditional Approaches

| Aspect | Traditional OOP | Jac OSP |
|--------|----------------|---------|
| Adding Operations | Modify all classes | Add new walker |
| Adding Types | Implement all methods | Extend walkers if needed |
| Logic Location | Scattered across classes | Centralized in walkers |
| Open/Closed Principle | Often violated | Fully respected |
| Code Reuse | Limited | High |
| Maintainability | Decreases with complexity | Scales well |

## Best Practices

1. **Single Responsibility**: Each walker should handle one operation
2. **Clear Naming**: Use descriptive names for walkers and their abilities
3. **Type Specificity**: Implement specific behavior for each item type
4. **Error Handling**: Include proper error handling in walkers
5. **Documentation**: Document the purpose and behavior of each walker

## Conclusion

Jac's Object Spatial Programming paradigm provides an elegant solution to the Expression Problem by:

- **Decoupling Data from Behavior**: Agents hold data, walkers provide operations
- **Enabling True Extensibility**: Add operations and types without modifying existing code
- **Improving Maintainability**: Centralize related logic and reduce coupling
- **Preserving Type Safety**: Maintain compile-time checking and type correctness

This spatial approach transforms complex object hierarchies into clean, modular, and extensible systems that grow gracefully with changing requirements.