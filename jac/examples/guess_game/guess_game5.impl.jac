impl GuessGame.start {
    if not [root --> (`?turn)] {
        next = root ++> turn(random.randint(1, 10));
    } else {
        next = [root --> (`?turn)];
    }
    visit next;
}

impl GuessGame.process_guess {
    if [-->] {
        visit [-->];
    } else {
        if self.guess < here.correct_number {
            print("Too high!");
            here ++> turn(here.correct_number);
        } elif self.guess > here.correct_number {
            print("Too low!");
            here ++> turn(here.correct_number);
        } else {
            print("Congratulations! You guessed correctly.");
            disengage;
        }
    }

}
