export class Score {
    #date;
    #hits;
    #percentage;
      
    constructor(hits, percentage) {
        this.#date = Date.now();
        this.#hits = hits;
        this.#percentage = percentage;
    }
      
    get hits() { return this.#hits; }
    get percentage() { return this.#percentage; }
    get date() { return getDate(this.#date); } 
}
