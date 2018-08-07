/*
	用于增强Text的功能，支持多样式文本嵌套更方便书写。
	<Text>确认</Text>
	<Text style={{color :'red'}}>确认</Text>
	<Text style={{color :'red'}}
		text={['string',
			 <Text key={'element'} style={{color:'#000',borderColor:'red',borderWidth:1}}>element</Text>,
			  {value : 'object', style:{color:'blue'}
		  }]}
	/>

*/
import React,{Component} from 'react';
import ReactNative, {Text} from 'react-native';

class EnhancedText extends Component {

    static propTypes = {
        ...ReactNative.Text.propTypes,
        text: React.PropTypes.oneOfType( [
            React.PropTypes.string,
            React.PropTypes.array,
            React.PropTypes.element
        ]),
    };
    getParsedText() {
		if(typeof this.props.text == 'string'){
			return this.props.text;
		}else if(this.props.text instanceof Array){
			return this.props.text.map((item, index) => {
				if(React.isValidElement(item)){
					return item;
				}else if(typeof item == 'string'){
					return <Text key={`key-${index}`}>{item}</Text>
				}else if(typeof item == 'object'){
					const {value, ...other} = item;
					return <Text key={`key-${index}`} {...other}>{value}</Text>
				}
			})
		}
    }

    render() {
		return (
			<Text {...this.props}>
				{this.props.children ? this.props.children : this.getParsedText()}
			</Text>
		)
	}

}

export default EnhancedText;
