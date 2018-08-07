const Nav = { 
	get NavBar() { return require('./NavBar').default; },
	get BackBtn() { return require('./BackBtn').default; }, 
	get RightNavBtn() { return require('./RightNavBtn').default; },
}
module.exports = Nav;