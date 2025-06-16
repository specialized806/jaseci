# Medical Software Startup

Welcome to our brand new medical software startup! Our first task is to model the relationship between a `Doctor` and a `Patient`. 

A patient has a doctor. A doctor has a name. Let's code it up!

```python
class Doctor:
    def __init__(self, name):
        self.name = name

class Patient:
    def __init__(self, name, doctor):
        self.name = name
        self.doctor = doctor # A patient has ONE doctor

# --- Let's test it out ---
dr_house = Doctor("Gregory House")
john_smith = Patient("John Smith", dr_house)

print(f"{john_smith.name}'s doctor is Dr. {john_smith.doctor.name}.")
```

Life is good. The code is simple, clean, and does exactly what we asked for. We high-five our teammates and go for lunch.

### Uh Oh... A New Requirement!

We get back from lunch and our Project Manager, Brenda, is at our desk.

**Brenda:** "Hey team! Great work this morning. Just a tiny change: it turns out a `Patient` can see many `Doctors` (a primary care physician, a specialist, etc.). Also, a `Doctor` obviously has many `Patients`. Can you update the model?"

Our simple `self.doctor` attribute is no longer enough. This is a **many-to-many** relationship.

"No problem, Brenda!" we say. The most straightforward solution is to use lists.

```python
class Doctor:
    def __init__(self, name):
        self.name = name
        self.patients = [] # A doctor can have many patients

    def add_patient(self, patient):
        self.patients.append(patient)

class Patient:
    def __init__(self, name):
        self.name = name
        self.doctors = [] # A patient can have many doctors

    def add_doctor(self, doctor):
        self.doctors.append(doctor)

# --- Let's wire it up ---
dr_house = Doctor("Gregory House")
dr_wilson = Doctor("James Wilson")

john_smith = Patient("John Smith")

john_smith.add_doctor(dr_house)
dr_house.add_patient(john_smith)

john_smith.add_doctor(dr_wilson)
dr_wilson.add_patient(john_smith)

print(f"{john_smith.name}'s doctors are: {', '.join(['Dr. ' + doc.name for doc in john_smith.doctors])}")
```

Okay, a bit more complex, but manageable. We've handled the many-to-many relationship. We're feeling pretty good about ourselves.

## The Relationship Gets Complicated

Brenda is back. She looks... anxious.

**Brenda:** "The stakeholders love it! But... they want to actually *bill* for a visit. So when a `Patient` sees a `Doctor`, we need to track the date, the diagnosis, and the cost of that specific visit. Where... does that information go?"

**Us:** "Uhhh..."

Let's think about this.

- Can we put `visit_cost` in the `Patient` class? No, a patient has different costs for different visits with different doctors.
- Can we put it in the `Doctor` class? No, the cost is different for each patient and each visit.

The information (cost, date, diagnosis) doesn't belong to the `Patient` or the `Doctor`. **It belongs to the interaction between them.**

Let's create a new class, `Claim`, to represent this relationship between doctor and patient.

```python
class Doctor:
    def __init__(self, name):
        self.name = name

class Patient:
    def __init__(self, name):
        self.name = name

class Claim:
    def __init__(self, patient, doctor, cost, diagnosis):
        self.patient = patient
        self.doctor = doctor
        self.cost = cost
        self.diagnosis = diagnosis
        self.status = "Submitted" # The claim has its own lifecycle!

    def __repr__(self):
        return f"Claim for {self.patient.name} with Dr. {self.doctor.name} for ${self.cost}"

# --- Let's model a visit ---
dr_house = Doctor("Gregory House")
john_smith = Patient("John Smith")

# John visits Dr. House for a checkup
claim1 = Claim(john_smith, dr_house, 250, "Routine Checkup")

print(claim1)
print(f"Status: {claim1.status}")
```

This is a huge improvement! Our design feels much cleaner. The `Claim` object neatly encapsulates all the information about a specific interaction.

## Houston, We Have a Communication Problem

Brenda is back. She's not even trying to hide her panic.

**Brenda:** "We need `InsuranceProviders`! The `Provider` has to approve a `Claim`. The approval amount depends on the `Doctor`'s network status and the `Patient`'s policy. Once the `Provider` approves it, the `Claim` status must change, the `Patient` needs to be notified of their co-pay, and the `Doctor` needs to know how much they're getting paid. How do they all talk to each other?!"

Let's try to code this directly.

```python
class InsuranceProvider:
    def process_claim(self, claim):
        # To do its job, the provider needs to know about the doctor and patient
        is_in_network = self.check_network_status(claim.doctor)
        deductible_met = self.check_patient_deductible(claim.patient)

        if is_in_network and deductible_met:
            claim.status = "Approved"
            # Now the claim has to tell everyone...
            claim.patient.update_balance(20) # Tell patient their co-pay
            claim.doctor.update_receivables(230) # Tell doctor they're getting paid
```

**Look at that `process_claim` method!** The `Provider` needs a reference to the `Claim`. The `Claim` needs references to the `Patient` and `Doctor` so it can call their methods.

What happens if the `Patient` class changes its `update_balance` method name? The `InsuranceProvider` code breaks! What if the `Doctor` wants a different notification? The `Claim` class has to be changed.

## JAC to the rescue!