function generateRoomName() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  return `${randomColor}-${randomAnimal}-${randomAction}`;
}

const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "black",
  "white",
  "gray",
  "gold",
  "silver",
  "maroon",
  "navy",
  "teal",
  "olive",
  "lime",
  "aqua",
  "fuchsia",
];

const animals = [
  "lion",
  "tiger",
  "bear",
  "wolf",
  "eagle",
  "shark",
  "dolphin",
  "elephant",
  "giraffe",
  "zebra",
  "panda",
  "koala",
  "kangaroo",
  "rhino",
  "hippo",
  "cheetah",
  "leopard",
  "gorilla",
  "monkey",
  "crocodile",
];

const actions = [
  "running",
  "jumping",
  "flying",
  "swimming",
  "dancing",
  "singing",
  "laughing",
  "sleeping",
  "eating",
  "drinking",
  "reading",
  "writing",
  "drawing",
  "painting",
  "cooking",
  "playing",
  "watching",
  "listening",
  "thinking",
  "dreaming",
];

module.exports = { generateRoomName };
