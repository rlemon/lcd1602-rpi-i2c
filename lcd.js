const i2c = require('i2c-bus');

const BUS = i2c.openSync(1);

let BLEN, LCD_ADDR; 

function writeWord(addr, data) {
	let temp = data;
	if( BLEN === 1 ) {
		temp |= 0x08;
	} else {
		temp &= 0xF7;
	}
	BUS.sendByteSync(addr, temp);
}

function sendCommand(comm) {
	let buf = comm & 0xF0;
	buf |= 0x04;
	writeWord(LCD_ADDR, buf);
	buf &= 0xFB;
	writeWord(LCD_ADDR, buf);
	buf = (comm & 0x0F) << 4;
	buf |= 0x04;
	writeWord(LCD_ADDR, buf)
	buf &= 0xFB;
	writeWord(LCD_ADDR, buf);
}

function sendData(data) {
	let buf = data & 0xF0;
	buf |= 0x05;
	writeWord(LCD_ADDR, buf);
	buf &= 0xFB;
	writeWord(LCD_ADDR, buf);
	buf = (data & 0x0F) << 4;
	buf |= 0x05;
	writeWord(LCD_ADDR, buf);
	buf &= 0xFB;
	writeWord(LCD_ADDR, buf);
}

function init(addr, bl) {
	LCD_ADDR = addr;
	BLEN = bl;
	for( cmd of [0x33, 0x32, 0x28, 0x0C, 0x01]) {
		sendCommand(cmd);
	}
	BUS.sendByteSync(LCD_ADDR, 0x08);
}

function write(x,y,str) {
	x = Math.min(15, Math.max(0, x));
	y = Math.min(1, Math.max(0, y));
	addr = 0x80 + 0x40 * y + x;
	sendCommand(addr);
	for( const chr of str.split('') ) {
		sendData(chr.charCodeAt(0))
	}
}

module.exports = {
	init: init,
	write: write
}
