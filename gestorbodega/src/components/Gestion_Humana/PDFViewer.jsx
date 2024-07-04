import React from 'react';

class PDFViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfURL: ''
    };
  }

  componentDidMount() {
    const { base64String } = this.props;
    const binaryString = atob(base64String); // Decodificar la cadena Base64
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    this.setState({ pdfURL: url });
  }

  render() {
    return (
      <div>
        <iframe title="se usa para ver el pdf"  src={this.state.pdfURL} style={{ width: '100%', height: '800px' }} />
      </div>
    );
  }
}

export default PDFViewer;
