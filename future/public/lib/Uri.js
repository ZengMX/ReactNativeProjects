export default class Uri {
	constructor(href){
		var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
	    if(match){
			this.protocol=match[1];
	        this.host=match[2];
	        this.hostname=match[3];
	        this.port=match[4];
	        this.pathname=match[5];
	        this.search=match[6];
	        this.hash=match[7];
		}
	}
}
