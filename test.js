const lcd = require('./lcd.js');

lcd.init(0x27, 1);
main();
function main() {
	const [line1, line2] = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ');
	lcd.write(0,0,line1);
	lcd.write(0,1,line2);
	setTimeout(main, 500);
}
