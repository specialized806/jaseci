import from mtllm.llms {Ollama}

glob llm = Ollama(
    host="http://127.0.0.1:11434",
    model_name="llama3.2:1b",
);

glob person_record: dict = {};

obj Person {
    has name: str;
    has age: int;
    has hobby: str;
    has description: str;
    has money: float;
    has inventory: list[InventoryItem];
}


"""
A Chat object contains the person's name and the message.
"""
obj Chat {
    has person: str;
    has message: str;
}


"""
Makes a transaction between buyer and seller for the specified item.
Returns true if successful, false otherwise.
"""
def make_transaction(buyer_name: str, seller_name: str, item_name: str) -> bool {
    buyer = person_record[buyer_name];
    seller = person_record[seller_name];

    # Find the item in seller's inventory
    item_to_buy = None;
    item_index = -1;

    for i in range(len(seller.inventory)) {
        if seller.inventory[i].name.lower() == item_name.lower() {
            item_to_buy = seller.inventory[i];
            item_index = i;
            break;
        }
    }

    # Check if item exists and buyer has enough money
    if not item_to_buy or buyer.money < item_to_buy.price {
        return False;
    }

    # Transfer item and money
    buyer.money -= item_to_buy.price;
    seller.money += item_to_buy.price;
    buyer.inventory.append(item_to_buy);
    seller.inventory.pop(item_index);

    return True;
}


"""
Generates the player character for a fantacy RPG game.
"""
def make_player() -> Person
    by llm();


"""
Generates a random npc person with a name, age, favourite pet and hobby.
The person should be a fantasy character, like an elf, dwarf, orc, etc.
"""
def make_random_npc() -> Person
    by llm();


"""
Generates the next line of dialogue from the given NPC in an ongoing
conversation with the player. If no chat history is provided, generates
the NPC's initial greeting. The NPC's response should reflect their
personality, background, and any prior context from the chat history.
"""
def chat_with_player(player: Person, npc: Person, chat_history: list[Chat]) -> Chat
    by llm(method="ReAct", tools=[make_transaction]);


with entry {

    # player = Person(name="Arin", age=24, hobby="swordsmanship", description="A brave and agile warrior skilled with the blade, ready to face any challenge.", money=150.0, inventory=[InventoryItem(name="Iron Sword", description="A sturdy iron sword, balanced and reliable.", price=100.0), InventoryItem(name="Leather Armor", description="Lightweight armor offering decent protection.", price=75.0), InventoryItem(name="Healing Potion", description="Restores health when consumed.", price=25.0)]);
    # npc = Person(name="Thalor", age=137, hobby="herbalism", description="An ancient elf who loves tending to mystical plants and caring for his pet raven.", money=80.0, inventory=[InventoryItem(name="Herb Pouch", description="A collection of rare herbs for potions.", price=40.0), InventoryItem(name="Raven Feather", description="A magical feather from his pet raven.", price=30.0)]);
    player = make_player();
    npc = make_random_npc();

    person_record[player.name] = player;
    person_record[npc.name] = npc;

    history = [];
    while True {
        chat = chat_with_player(player, npc, history);
        history.append(chat);
        for p in [player, npc] {
            print(p.name, ":  $", p.money);
            for i in p.inventory {
                print("  ", i.name, ":  $", i.price);
            }
        }
        print("\n[[npc]] >> ", chat.message);
        inp = input("\n[[Player input]] >> ");
        history.append(Chat(person=player.name, message=inp));
    }

}
