import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Input } from 'react-native-elements';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import RNPickerSelect from 'react-native-picker-select';

import countryCodes from './country-codes';
import errorStrings from './error-strings';
import validator from './validator';
import formatter from './formatter';
import cleaner from './cleaner';

const styles = ScaledSheet.create({
  container: {
    paddingHorizontal: '10@ms',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputs: {
    fontSize: '14@ms',
  },
  intContainer: {
    width: '22%',
    height: '40@ms',
    borderBottomWidth: '1@ms',
    justifyContent: 'center',
  },
  inputNumContainer: {
    height: '40@ms',
    borderBottomWidth: '1@ms',
    borderBottomColor: 'black',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  numContainer: {
    width: '75%',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
});

class MobileInputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputs: {
        int: '+1',
        num: '',
      },
      errors: {
        numEr: '',
      },
    };
  }

  performValidation = (value) => {
    if(value.length < 1) return;
    const { disableFormatter } = this.props;
    const { inputs } = this.state;
    const { int } = inputs;
    if (validator[int](value) === true) {
      this.validationPassed(value);
      !disableFormatter ? this.formatValidatedValue(value) : value;
    } else {
      this.validationFailed();
      this.formFailedValue(value);
    }
  }

  formFailedValue = (value) => {
    const { inputs } = this.state;
    const cleanValue = cleaner(value);
    const newInput = { ...inputs };
    newInput.num = cleanValue;
    this.setState({
      inputs: newInput,
    });
  }

  formatValidatedValue = (value) => {
    const { inputs } = this.state;
    const { int } = inputs;
    const formattedValue = formatter[int](value);
    const newInput = { ...inputs };
    newInput.num = formattedValue;
    this.setState({
      inputs: newInput,
    });
  }

  validationFailed = () => {
    const state = { ...this.state };
    const { errors } = state;
    errors.numEr = errorStrings.numEr;
    this.setState({
      errors,
    });
  }

  validationPassed = () => {
    const { onEndInput } = this.props;
    const state = { ...this.state };
    const { errors } = state;
    errors.numEr = '';
    this.setState({
      errors,
    }, () => {
      const { inputs } = this.state;
      const { int, num } = inputs;
      return onEndInput(`${int} ${num}`);
    });
  }

  onInputChange = (value) => {
    const state = { ...this.state };
    const { inputs } = state;
    inputs.num = value;
    this.setState({
      inputs,
    });
  }

  onInputEnd = (event, ref) => {
    const { text } = event.nativeEvent;
    const cleanText = cleaner(text);
    this.performValidation(cleanText);
    if (ref) this[ref].focus();
  }

  render() {
    const {
      inputs,
      errors,
    } = this.state;
    const {
      num,
    } = inputs;
    const {
      numEr,
    } = errors;
    const {
      containerStyle,
      placeholderNum,
      intContainerStyle,
      numContainerStyle,
      inputNumContainerStyle,
      pickerInputStyle,
      errorStyleNum,
      shake,
      nextRef,
      disableNumError,
      inputStyle,
    } = this.props;

    return (
      <View style={[styles.container, { ...containerStyle }]}>
        <View style={[styles.intContainer, { ...intContainerStyle }]}>
          <RNPickerSelect
            placeholder={{}}
            items={countryCodes}
            onValueChange={(value) => {
              const { inputs } = this.state;
              const newInput = { ...inputs };
              newInput.int = value;
              this.setState({
                inputs: newInput,
              }, () => {
                const { num } = this.state.inputs;
                this.performValidation(num);
              })}}
            style={{
              inputIOS: {
                fontSize: moderateScale(14),
                ...pickerInputStyle,
              },
              inputAndroid: {
                fontSize: moderateScale(14),
                ...pickerInputStyle,
              },
            }}
            Icon={() => null}
            value={this.state.value}
            useNativeAndroidPickerStyle={false}
            ref={(el) => this.mobileInt = el }
          />
        </View>
        <Input
          inputStyle={[styles.inputs, { ...inputStyle }]}
          onEndEditing={(event) => { this.onInputEnd(event, nextRef); }}
          ref={(mobileNum) => { this.mobileNum = mobileNum; }}
          keyboardType="number-pad"
          maxLength={18}
          value={num}
          onChangeText={text => this.onInputChange(text)}
          inputContainerStyle={[styles.inputNumContainer, { ...inputNumContainerStyle }]}
          containerStyle={[styles.numContainer, { ...numContainerStyle }]}
          shake={shake}
          placeholder={placeholderNum}
          errorMessage={!disableNumError ? numEr : null}
          errorStyle={[errorStyleNum]}
        />
      </View>
    );
  }
}

MobileInputs.defaultProps = {
  onEndInput: () => null,
  placeholderInt: '+1',
  placeholderNum: '(718) 111 2222',
  containerStyle: {},
  shake: false,
  numContainerStyle: {},
  inputNumContainerStyl: {},
  intContainerStyle: {},
  errorStyleNum: {},
  nextRef: '',
  disableNumError: false,
  disableFormatter: false,
  inputStyle: {},
};

MobileInputs.propTypes = {
  onEndInput: PropTypes.func,
  placeholderInt: PropTypes.string,
  placeholderNum: PropTypes.string,
  containerStyle: PropTypes.shape({}),
  shake: PropTypes.bool,
  numContainerStyle: PropTypes.shape({}),
  inputNumContainerStyle: PropTypes.shape({}),  
  intContainerStyle: PropTypes.shape({}),
  errorStyleNum: PropTypes.shape({}),
  nextRef: PropTypes.string,
  disableNumError: PropTypes.bool,
  disableFormatter: PropTypes.bool,
  inputStyle: PropTypes.shape({}),
};

export default MobileInputs;
