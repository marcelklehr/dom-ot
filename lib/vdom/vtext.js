module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.type = "VirtualText"
