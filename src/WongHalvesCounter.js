class WongHalvesCounter {
  constructor(decks = 6) {
    this.decks = decks;
    this.reset();
  }

  reset() {
    this.runningCount = 0;
    this.cardsSeen = 0;
    this.trueCount = 0;
  }

  cardValue(card) {
    const values = {
      '2': 0.5, '3': 1, '4': 1, '5': 1.5, '6': 1, '7': 0.5, '8': 0, '9': -0.5,
      '10': -1, 'J': -1, 'Q': -1, 'K': -1, 'A': -1
    };
    return values[card] || 0;
  }

  updateCount(cards) {
    cards.forEach(card => {
      this.runningCount += this.cardValue(card);
      this.cardsSeen += 1;
    });
    this.updateTrueCount();
  }

  updateTrueCount() {
    const decksRemaining = this.decks - (this.cardsSeen / 52);
    this.trueCount = this.runningCount / decksRemaining;
  }

  getCurrentCount() {
    return {
      runningCount: this.runningCount,
      trueCount: this.trueCount.toFixed(2)
    };
  }
}

export default WongHalvesCounter;
