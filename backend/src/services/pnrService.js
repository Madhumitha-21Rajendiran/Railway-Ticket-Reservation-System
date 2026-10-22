const generatePNR = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `PNR${timestamp}${random}`;
};

module.exports = generatePNR;