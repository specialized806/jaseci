"""Try/except test."""

def risky_operation() {
    try {
        x = 10 / 0;
    } except Exception as e {
        print("Error occurred");
    } finally {
        print("Cleanup");
    }
}
