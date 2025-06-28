# Chapter 18: Testing and Debugging

In this chapter, we'll explore Jac's built-in testing capabilities and debugging techniques. We'll build a comprehensive test suite for a classroom graph system that demonstrates test block syntax, walker behavior testing, and debugging strategies through practical examples.

!!! info "What You'll Learn"
    - Writing tests using Jac's built-in test block syntax
    - Testing walker behavior and graph interactions
    - Debugging techniques for Object-Spatial Programming
    - Test-driven development patterns in Jac
    - Performance testing and optimization

---

## Test Block Syntax

Jac provides built-in testing capabilities through test blocks that integrate seamlessly with your application code. Unlike traditional testing frameworks, Jac tests are part of the language itself, making them easy to write and maintain.

!!! success "Testing Benefits"
    - **Built-in Framework**: No external testing libraries needed
    - **Type Safety**: Test assertions leverage Jac's type system
    - **Graph Testing**: Native support for testing nodes, edges, and walkers
    - **Integrated Debugging**: Tests can be debugged alongside application code
    - **Automatic Discovery**: Tests are automatically discovered and executed

### Traditional vs Jac Testing

!!! example "Testing Comparison"
    === "Traditional Approach"
        ```python
        # test_classroom.py - External testing framework required
        import unittest
        from classroom import Student, Teacher, Classroom

        class TestClassroom(unittest.TestCase):
            def setUp(self):
                self.classroom = Classroom("Math 101")
                self.teacher = Teacher("Ms. Smith", "Mathematics")
                self.student1 = Student("Alice", 16, "A")
                self.student2 = Student("Bob", 17, "B")

            def test_add_student(self):
                self.classroom.add_student(self.student1)
                self.assertEqual(len(self.classroom.students), 1)
                self.assertIn(self.student1, self.classroom.students)

            def test_assign_teacher(self):
                self.classroom.assign_teacher(self.teacher)
                self.assertEqual(self.classroom.teacher, self.teacher)

            def test_classroom_capacity(self):
                # Add multiple students
                for i in range(30):
                    student = Student(f"Student{i}", 16, "A")
                    self.classroom.add_student(student)

                with self.assertRaises(ValueError):
                    overflow_student = Student("Overflow", 16, "A")
                    self.classroom.add_student(overflow_student)

        if __name__ == '__main__':
            unittest.main()
        ```

    === "Jac Built-in Testing"
        <div class="code-block">
        ```jac
        # classroom.jac - Built-in test blocks
        node Student {
            has name: str;
            has age: int;
            has grade: str;
        }

        node Teacher {
            has name: str;
            has subject: str;
        }

        node Classroom {
            has name: str;
            has capacity: int = 25;

            can add_student(student: Student) -> bool {
                current_students = [self --> Student];
                if len(current_students) >= self.capacity {
                    return False;
                }
                self ++> student;
                return True;
            }

            can get_student_count() -> int {
                return len([self --> Student]);
            }
        }

        test "can create classroom with students" {
            classroom = Classroom(name="Math 101");
            student1 = Student(name="Alice", age=16, grade="A");
            student2 = Student(name="Bob", age=17, grade="B");

            # Test adding students
            assert classroom.add_student(student1) == True;
            assert classroom.add_student(student2) == True;
            assert classroom.get_student_count() == 2;

            # Test student connections
            students = [classroom --> Student];
            assert len(students) == 2;
            assert student1 in students;
            assert student2 in students;
        }

        test "classroom capacity limits" {
            classroom = Classroom(name="Small Class", capacity=2);
            student1 = Student(name="Alice", age=16, grade="A");
            student2 = Student(name="Bob", age=17, grade="B");
            student3 = Student(name="Charlie", age=16, grade="C");

            # Fill to capacity
            assert classroom.add_student(student1) == True;
            assert classroom.add_student(student2) == True;

            # Test capacity limit
            assert classroom.add_student(student3) == False;
            assert classroom.get_student_count() == 2;
        }
        ```
        </div>

---

## Basic Test Structure

Let's start with a simple classroom system and build comprehensive tests around it:

### Setting Up the Classroom System

!!! example "Basic Classroom Implementation"
    === "Jac"
        <div class="code-block">
        ```jac
        # classroom_system.jac
        node Student {
            has name: str;
            has age: int;
            has grade: str;
            has enrolled_date: str = "2024-01-15";

            can get_info() -> str {
                return f"{self.name} (Age: {self.age}, Grade: {self.grade})";
            }
        }

        node Teacher {
            has name: str;
            has subject: str;
            has years_experience: int;

            can can_teach(subject: str) -> bool {
                return self.subject.lower() == subject.lower();
            }
        }

        node Classroom {
            has name: str;
            has capacity: int = 25;
            has room_number: str;

            can add_student(student: Student) -> bool {
                if self.get_student_count() >= self.capacity {
                    return False;
                }
                self ++> student;
                return True;
            }

            can assign_teacher(teacher: Teacher) -> bool {
                existing_teachers = [self --> Teacher];
                if existing_teachers {
                    return False;  # Only one teacher per classroom
                }
                self ++> teacher;
                return True;
            }

            can get_student_count() -> int {
                return len([self --> Student]);
            }

            can get_students() -> list[Student] {
                return [self --> Student];
            }
        }

        # Basic functionality test
        test "basic classroom operations" {
            # Create entities
            classroom = Classroom(name="Biology 101", room_number="B204");
            teacher = Teacher(name="Dr. Wilson", subject="Biology", years_experience=10);
            student = Student(name="Emma", age=16, grade="A");

            # Test teacher assignment
            assert classroom.assign_teacher(teacher) == True;
            teachers = [classroom --> Teacher];
            assert len(teachers) == 1;
            assert teachers[0].name == "Dr. Wilson";

            # Test student enrollment
            assert classroom.add_student(student) == True;
            assert classroom.get_student_count() == 1;

            # Test student info
            students = classroom.get_students();
            assert len(students) == 1;
            assert students[0].name == "Emma";
        }
        ```
        </div>

    === "Python Equivalent"
        ```python
        # classroom_system.py - Requires external testing
        class Student:
            def __init__(self, name: str, age: int, grade: str, enrolled_date: str = "2024-01-15"):
                self.name = name
                self.age = age
                self.grade = grade
                self.enrolled_date = enrolled_date

            def get_info(self) -> str:
                return f"{self.name} (Age: {self.age}, Grade: {self.grade})"

        class Teacher:
            def __init__(self, name: str, subject: str, years_experience: int):
                self.name = name
                self.subject = subject
                self.years_experience = years_experience

            def can_teach(self, subject: str) -> bool:
                return self.subject.lower() == subject.lower()

        class Classroom:
            def __init__(self, name: str, room_number: str, capacity: int = 25):
                self.name = name
                self.capacity = capacity
                self.room_number = room_number
                self.students = []
                self.teachers = []

            def add_student(self, student: Student) -> bool:
                if len(self.students) >= self.capacity:
                    return False
                self.students.append(student)
                return True

            def assign_teacher(self, teacher: Teacher) -> bool:
                if self.teachers:
                    return False
                self.teachers.append(teacher)
                return True

            def get_student_count(self) -> int:
                return len(self.students)

        # Would require separate test file with unittest
        ```

### Running Tests

```bash
# Run all tests in the file
jac test classroom_system.jac

# Run specific test
jac test classroom_system.jac -k "basic classroom operations"
```

---

## Walker Behavior Testing

Walkers are central to Jac's Object-Spatial Programming paradigm. Testing walker behavior requires understanding how they interact with graphs and process data.

### Message Delivery Walker

!!! example "Walker Testing System"
    <div class="code-block">
    ```jac
    # message_system.jac
    node Message {
        has content: str;
        has sender: str;
        has timestamp: str;
        has is_read: bool = False;
    }

    walker deliver_message {
        has message_content: str;
        has sender_name: str;
        has target_student_name: str;

        can find_and_deliver with Classroom entry {
            # Find target student
            students = [here --> Student];
            target_student = None;

            for student in students {
                if student.name == self.target_student_name {
                    target_student = student;
                    break;
                }
            }

            if target_student {
                # Create and deliver message
                message = Message(
                    content=self.message_content,
                    sender=self.sender_name,
                    timestamp="2024-01-15 10:30"
                );
                target_student ++> message;
                report {"status": "delivered", "to": target_student.name};
            } else {
                report {"status": "failed", "error": "Student not found"};
            }
        }
    }

    walker read_messages {
        has student_name: str;

        can collect_messages with Classroom entry {
            students = [here --> Student];
            target_student = None;

            for student in students {
                if student.name == self.student_name {
                    target_student = student;
                    break;
                }
            }

            if target_student {
                messages = [target_student --> Message];
                message_list = [
                    {
                        "content": msg.content,
                        "sender": msg.sender,
                        "timestamp": msg.timestamp,
                        "is_read": msg.is_read
                    }
                    for msg in messages
                ];
                report {"student": self.student_name, "messages": message_list};
            } else {
                report {"error": "Student not found"};
            }
        }
    }

    # Test walker behavior
    test "message delivery walker" {
        # Setup classroom with students
        classroom = Classroom(name="English 101", room_number="E102");
        student1 = Student(name="Alice", age=16, grade="A");
        student2 = Student(name="Bob", age=17, grade="B");

        classroom.add_student(student1);
        classroom.add_student(student2);

        # Test message delivery
        delivery_walker = deliver_message(
            message_content="Please submit your homework",
            sender_name="Teacher",
            target_student_name="Alice"
        );

        result = delivery_walker spawn classroom;
        assert result[0]["status"] == "delivered";
        assert result[0]["to"] == "Alice";

        # Verify message was created
        alice_messages = [student1 --> Message];
        assert len(alice_messages) == 1;
        assert alice_messages[0].content == "Please submit your homework";
        assert alice_messages[0].sender == "Teacher";
    }

    test "message reading walker" {
        # Setup with existing messages
        classroom = Classroom(name="History 101", room_number="H201");
        student = Student(name="Charlie", age=16, grade="B");
        classroom.add_student(student);

        # Add messages directly
        msg1 = Message(content="Test message 1", sender="Teacher", timestamp="2024-01-15 09:00");
        msg2 = Message(content="Test message 2", sender="Principal", timestamp="2024-01-15 11:00");
        student ++> msg1;
        student ++> msg2;

        # Test reading messages
        read_walker = read_messages(student_name="Charlie");
        result = read_walker spawn classroom;

        assert result[0]["student"] == "Charlie";
        assert len(result[0]["messages"]) == 2;
        assert result[0]["messages"][0]["content"] == "Test message 1";
        assert result[0]["messages"][1]["sender"] == "Principal";
    }

    test "walker error handling" {
        classroom = Classroom(name="Math 101", room_number="M301");
        student = Student(name="David", age=17, grade="A");
        classroom.add_student(student);

        # Test delivery to non-existent student
        delivery_walker = deliver_message(
            message_content="Test message",
            sender_name="Teacher",
            target_student_name="NonExistent"
        );

        result = delivery_walker spawn classroom;
        assert result[0]["status"] == "failed";
        assert result[0]["error"] == "Student not found";

        # Test reading from non-existent student
        read_walker = read_messages(student_name="NonExistent");
        result = read_walker spawn classroom;
        assert "error" in result[0];
        assert result[0]["error"] == "Student not found";
    }
    ```
    </div>

---

## Test Organization and Patterns

Proper test organization helps maintain code quality and makes debugging easier. Let's explore advanced testing patterns.

### Test Fixtures and Setup

!!! example "Advanced Test Patterns"
    <div class="code-block">
    ```jac
    # advanced_classroom_tests.jac

    # Test helper function
    def create_test_classroom() -> Classroom {
        classroom = Classroom(name="Test Class", room_number="T100", capacity=3);
        teacher = Teacher(name="Test Teacher", subject="Testing", years_experience=5);
        classroom.assign_teacher(teacher);
        return classroom;
    }

    def create_test_students() -> list[Student] {
        return [
            Student(name="Alice", age=16, grade="A"),
            Student(name="Bob", age=17, grade="B"),
            Student(name="Charlie", age=16, grade="C")
        ];
    }

    # Comprehensive classroom capacity test
    test "classroom capacity management" {
        classroom = create_test_classroom();
        students = create_test_students();

        # Test adding students within capacity
        for i in range(3) {
            assert classroom.add_student(students[i]) == True;
            assert classroom.get_student_count() == i + 1;
        }

        # Test capacity exceeded
        overflow_student = Student(name="David", age=18, grade="D");
        assert classroom.add_student(overflow_student) == False;
        assert classroom.get_student_count() == 3;

        # Verify existing students unaffected
        classroom_students = classroom.get_students();
        assert len(classroom_students) == 3;
        student_names = [s.name for s in classroom_students];
        assert "Alice" in student_names;
        assert "Bob" in student_names;
        assert "Charlie" in student_names;
        assert "David" not in student_names;
    }

    # Test graph relationships
    test "graph relationship integrity" {
        classroom = create_test_classroom();
        students = create_test_students();

        # Add students and verify connections
        for student in students {
            classroom.add_student(student);
        }

        # Test bidirectional relationships
        classroom_students = [classroom --> Student];
        assert len(classroom_students) == 3;

        # Test each student is properly connected
        for student in students {
            connected_classrooms = [student <-- Classroom];
            assert len(connected_classrooms) == 1;
            assert connected_classrooms[0].name == "Test Class";
        }

        # Test teacher relationship
        classroom_teacher = [classroom --> Teacher];
        assert len(classroom_teacher) == 1;
        assert classroom_teacher[0].subject == "Testing";
    }

    # Performance test
    test "classroom performance with many students" {
        large_classroom = Classroom(name="Large Class", room_number="L500", capacity=100);

        # Add many students
        for i in range(50) {
            student = Student(name=f"Student{i}", age=16, grade="A");
            assert large_classroom.add_student(student) == True;
        }

        # Test performance of student operations
        assert large_classroom.get_student_count() == 50;
        all_students = large_classroom.get_students();
        assert len(all_students) == 50;

        # Verify specific student lookup
        target_student = None;
        for student in all_students {
            if student.name == "Student25" {
                target_student = student;
                break;
            }
        }
        assert target_student is not None;
        assert target_student.name == "Student25";
    }
    ```
    </div>

---

## Debugging Techniques

Jac provides several debugging techniques specifically designed for Object-Spatial Programming patterns.

### Debug Output and Assertions

!!! example "Debugging Walker Behavior"
    <div class="code-block">
    ```jac
    # debug_example.jac
    walker debug_classroom_walker {
        has debug_mode: bool = True;

        can analyze_classroom with Classroom entry {
            if self.debug_mode {
                print(f"Analyzing classroom: {here.name}");
            }

            # Collect data with debug output
            students = [here --> Student];
            teachers = [here --> Teacher];

            if self.debug_mode {
                print(f"Found {len(students)} students and {len(teachers)} teachers");
                for student in students {
                    print(f"  Student: {student.name}, Grade: {student.grade}");
                }
            }

            # Debug assertion
            assert len(teachers) <= 1, f"Too many teachers: {len(teachers)}";

            # Analyze student performance
            grade_counts = {"A": 0, "B": 0, "C": 0, "D": 0, "F": 0};
            for student in students {
                if student.grade in grade_counts {
                    grade_counts[student.grade] += 1;
                }
            }

            if self.debug_mode {
                print(f"Grade distribution: {grade_counts}");
            }

            report {
                "classroom": here.name,
                "student_count": len(students),
                "teacher_count": len(teachers),
                "grade_distribution": grade_counts
            };
        }
    }

    # Test with debugging
    test "debug walker analysis" {
        classroom = Classroom(name="Debug Class", room_number="D100");
        teacher = Teacher(name="Debug Teacher", subject="Computer Science", years_experience=3);
        classroom.assign_teacher(teacher);

        # Add students with various grades
        students = [
            Student(name="Alice", age=16, grade="A"),
            Student(name="Bob", age=17, grade="B"),
            Student(name="Charlie", age=16, grade="A"),
            Student(name="David", age=18, grade="C")
        ];

        for student in students {
            classroom.add_student(student);
        }

        # Run debug walker
        debug_walker = debug_classroom_walker(debug_mode=True);
        result = debug_walker spawn classroom;

        # Verify results
        assert result[0]["classroom"] == "Debug Class";
        assert result[0]["student_count"] == 4;
        assert result[0]["teacher_count"] == 1;
        assert result[0]["grade_distribution"]["A"] == 2;
        assert result[0]["grade_distribution"]["B"] == 1;
        assert result[0]["grade_distribution"]["C"] == 1;
    }

    # Error handling test
    test "debug error conditions" {
        # Test with malformed classroom
        empty_classroom = Classroom(name="Empty Class", room_number="E000");

        debug_walker = debug_classroom_walker(debug_mode=True);
        result = debug_walker spawn empty_classroom;

        # Should handle empty classroom gracefully
        assert result[0]["student_count"] == 0;
        assert result[0]["teacher_count"] == 0;

        # All grade counts should be zero
        grade_dist = result[0]["grade_distribution"];
        assert all(count == 0 for count in grade_dist.values());
    }
    ```
    </div>

### Testing Edge Cases

!!! example "Edge Case Testing"
    <div class="code-block">
    ```jac
    # edge_case_tests.jac

    test "boundary conditions" {
        # Test minimum capacity classroom
        min_classroom = Classroom(name="Tiny Class", room_number="T001", capacity=1);
        student1 = Student(name="Alice", age=16, grade="A");
        student2 = Student(name="Bob", age=17, grade="B");

        # First student should succeed
        assert min_classroom.add_student(student1) == True;
        assert min_classroom.get_student_count() == 1;

        # Second student should fail
        assert min_classroom.add_student(student2) == False;
        assert min_classroom.get_student_count() == 1;

        # Test zero capacity (edge case)
        zero_classroom = Classroom(name="No Space", room_number="N000", capacity=0);
        assert zero_classroom.add_student(student1) == False;
        assert zero_classroom.get_student_count() == 0;
    }

    test "duplicate operations" {
        classroom = Classroom(name="Duplicate Test", room_number="DT01");
        student = Student(name="Alice", age=16, grade="A");
        teacher1 = Teacher(name="Teacher One", subject="Math", years_experience=5);
        teacher2 = Teacher(name="Teacher Two", subject="Science", years_experience=3);

        # Add student twice (should both succeed as different instances)
        assert classroom.add_student(student) == True;
        # Note: In this implementation, same instance can't be added twice
        # But creating a new instance with same data would be allowed

        # Add second teacher should fail
        assert classroom.assign_teacher(teacher1) == True;
        assert classroom.assign_teacher(teacher2) == False;

        # Verify state
        teachers = [classroom --> Teacher];
        assert len(teachers) == 1;
        assert teachers[0].name == "Teacher One";
    }

    test "data validation edge cases" {
        # Test with extreme values
        old_student = Student(name="Old Student", age=99, grade="A");
        young_student = Student(name="Young Student", age=5, grade="F");

        classroom = Classroom(name="Age Test", room_number="AT01");

        # Both should be accepted (no age validation in current implementation)
        assert classroom.add_student(old_student) == True;
        assert classroom.add_student(young_student) == True;

        # Test empty/unusual names
        empty_name_student = Student(name="", age=16, grade="A");
        long_name_student = Student(name="Very Long Student Name That Goes On Forever", age=16, grade="A");

        assert classroom.add_student(empty_name_student) == True;
        assert classroom.add_student(long_name_student) == True;

        assert classroom.get_student_count() == 4;
    }
    ```
    </div>

---

## Key Takeaways

!!! summary "What We've Learned"
    - **Built-in Testing**: Jac's test blocks provide integrated testing without external frameworks
    - **Walker Testing**: Specialized patterns for testing graph traversal and walker behavior
    - **Debug Integration**: Built-in debugging features work seamlessly with tests
    - **Edge Case Coverage**: Comprehensive testing includes boundary conditions and error cases
    - **Graph Verification**: Testing relationships and connections in Object-Spatial Programming

### Next Steps

In the upcoming chapters, we'll explore:
- **Chapter 19**: Deployment strategies for tested applications
- **Chapter 20**: Performance optimization based on test insights
- **Chapter 21**: Building complete applications with comprehensive test suites

!!! tip "Try It Yourself"
    Enhance the classroom system with:
    - Tests for grade calculation and student progression
    - Performance tests for large-scale classroom management
    - Integration tests for multiple interacting walkers
    - Stress tests for concurrent walker operations

    Remember: Good tests make debugging easier and code more reliable!

---

*Ready to learn about deployment strategies? Continue to [Chapter 19: Deployment Strategies](chapter_19.md)!*
