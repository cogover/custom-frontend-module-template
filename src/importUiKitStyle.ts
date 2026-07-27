if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    void import('@stringeecom/ui-kit/style.css');
}
