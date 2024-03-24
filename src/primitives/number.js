export default function config() {
    Number.prototype.format = function(opts = {}) {
        let num = this
        if(opts.decimalPlaces) num = +num.toFixed(2)
        if(opts.currency) {
            return this.toLocaleString(navigator.language, {
                style: "currency",
                currency: opts.currency
            })
        }
        return num.toLocaleString(navigator.language)
    }
}