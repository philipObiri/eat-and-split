import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


export default function App() {
  const [friends, setFriends] = useState(initialFriends);

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  //  A function to hide or show the forms for creating a new friend
  function handleShowAddFriend() {
    setShowAddFriend(showAddFriend => !showAddFriend);
  }

  // A function to add a newly created friend to the list of existing friends
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((currentlySelectedFriend) => currentlySelectedFriend?.id === friend.id ? null : friend);
    setShowAddFriend(false);
  }


  function handleSplitBill(value) {
    // console.log(value);
    setFriends(friends => friends.map(friend => friend.id
      === selectedFriend.id ? { ...friend, balance: (friend.balance + value) } : friend))

    setSelectedFriend(null);
  }


  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && <AddFriendForm onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend} >
          {showAddFriend ? "Close " : "Add Friend"}
        </Button>

      </div>

      {
      selectedFriend && 
      <SplitBillForm 
      selectedFriend={selectedFriend} 
      onSplitBill={handleSplitBill} 
      key={selectedFriend.id}  />}
    </div>
  );
}


function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) =>
      (<Friend
        friend={friend}
        key={friend.id}
        selectedFriend={selectedFriend}
        onSelection={onSelection} />)
      )}
    </ul>
  );
}



function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id

  return (

    <li className={isSelected ? "selected" : ""}>
      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
      <img src={friend.image} alt={friend.name} />
      <h3> {friend.name}</h3>
      {
        friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} ${Math.abs(friend.balance)}
          </p>
        )

      }
      {
        friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you ${Math.abs(friend.balance)}
          </p>
        )

      }
      {
        friend.balance === 0 && (
          <p>
            You and {friend.name} are even
          </p>
        )

      }
    </li>
  )
}



function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImageURL] = useState("https://i.pravatar.cc/48");

  function handleSubmit(event) {
    event.preventDefault();
    if (!name || !image) return

    // create a new friend
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0
    };

    setName("");
    setImageURL("https://i.pravatar.cc/48");

    // Add the and render the details of the new friend on the existing list :
    onAddFriend(newFriend)
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend Name</label>
      <input type="text" value={name} onChange={(event) => setName(event.target.value)} />

      <label>🔍 Image URL</label>
      <input type="text" value={image} onChange={(event) => setImageURL(event.target.value)} />
      <Button> Add</Button>
    </form>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}


function SplitBillForm({ selectedFriend, onSplitBill }) {
  // There are three states that control the input components:
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(event) {

    event.preventDefault();

    if (!bill || !paidByUser) return;
    // if (NaN(bill) || NaN(paidByUser)) return;  

    onSplitBill(whoIsPaying === "user" ? paidByFriend :
      -paidByUser)



  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵 Bill Value</label>
      <input type="text" value={bill} onChange={(event) => setBill(Number(event.target.value))} />

      <label>🤵🏼 Your Expense</label>
      <input type="text" value={paidByUser}
        onChange={(event) => setPaidByUser(
          Number(event.target.value) > bill ? paidByUser :
            Number(event.target.value))} />

      <label>👫{selectedFriend.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is Paying The Bill ?</label>
      <select value={whoIsPaying} onChange={(event) => setWhoIsPaying(event.target.value)} >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  )
}