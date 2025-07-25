import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'md',
  color = 'primary',
  fullScreen = false,
  className = '',
  showText = false,
  text = 'Loading...',
  textPosition = 'bottom'
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-4 w-4 border-2',
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-10 w-10 border-[3px]',
    xl: 'h-12 w-12 border-4'
  };

  // Color classes
  const colorClasses = {
    primary: 'border-t-blue-500 border-blue-200',
    secondary: 'border-t-purple-500 border-purple-200',
    success: 'border-t-green-500 border-green-200',
    danger: 'border-t-red-500 border-red-200',
    warning: 'border-t-yellow-500 border-yellow-200',
    light: 'border-t-gray-200 border-gray-100',
    dark: 'border-t-gray-800 border-gray-300'
  };

  // Text position classes
  const textPositionClasses = {
    top: 'flex-col-reverse',
    bottom: 'flex-col',
    left: 'flex-row-reverse',
    right: 'flex-row'
  };

  // Text size classes
  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`${fullScreen ? 'fixed inset-0 flex items-center justify-center' : 'inline-flex'} ${className}`}>
      <div className={`flex items-center justify-center ${textPositionClasses[textPosition]} gap-2`}>
        {showText && (textPosition === 'top' || textPosition === 'left') && (
          <span className={`${textSizeClasses[size]} text-current`}>{text}</span>
        )}
        
        <div
          className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${fullScreen ? 'border-t-4 border-4' : ''}`}
        />
        
        {showText && (textPosition === 'bottom' || textPosition === 'right') && (
          <span className={`${textSizeClasses[size]} text-current`}>{text}</span>
        )}
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'light', 'dark']),
  fullScreen: PropTypes.bool,
  className: PropTypes.string,
  showText: PropTypes.bool,
  text: PropTypes.string,
  textPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right'])
};

export default LoadingSpinner;