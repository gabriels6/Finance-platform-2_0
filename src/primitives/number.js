export default function configure() {
    Number.prototype.toString = function() {
        return this.toLocaleString()
    }
}