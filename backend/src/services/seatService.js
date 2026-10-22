const hasEnoughSeats = (train, seatCount) => {
  return train.availableSeats >= seatCount;
};

const reduceSeats = async (train, seatCount) => {
  train.availableSeats -= seatCount;
  await train.save();
};

const increaseSeats = async (train, seatCount) => {
  train.availableSeats += seatCount;
  await train.save();
};

module.exports = {
  hasEnoughSeats,
  reduceSeats,
  increaseSeats,
};