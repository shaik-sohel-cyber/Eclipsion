import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    console.log('ErrorBoundary: Caught error:', error.message);
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="container mx-auto p-6 text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h2>
          <p className="text-tech-light">{this.state.error.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;