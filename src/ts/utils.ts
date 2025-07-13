export function getCssVariablePx(variableName: string): number {
    const testDiv = document.createElement('div');
    testDiv.style.position = 'absolute';  // para no afectar layout
    testDiv.style.width = `var(${variableName})`;
    document.body.appendChild(testDiv);
    const size = testDiv.getBoundingClientRect().width;
    testDiv.remove();
    return size;
}