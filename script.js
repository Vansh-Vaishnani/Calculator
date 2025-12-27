const previousEl = document.getElementById('previous');
const currentEl = document.getElementById('current');

let current = '0';
let previous = '';
let operator = null;
let overwrite = false;

function updateDisplay(){
  currentEl.textContent = current;
  previousEl.textContent = operator ? `${previous} ${operator}` : previous;
}

function appendNumber(n){
  if(overwrite){ current = '0'; overwrite = false }
  if(n === '.' && current.includes('.')) return;
  if(current === '0' && n !== '.') current = n; else current = current + n;
}

function chooseOperator(op){
  if(!current) return;
  if(previous && operator && !overwrite){
    compute();
  }
  operator = op;
  previous = current;
  overwrite = true;
}

function compute(){
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if(isNaN(a) || isNaN(b)) return;
  let result;
  switch(operator){
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    default: return;
  }
  current = String(result);
  previous = '';
  operator = null;
  overwrite = true;
}

function clearAll(){ current = '0'; previous = ''; operator = null; overwrite = false }

function deleteLast(){
  if(overwrite){ current = '0'; overwrite = false; return }
  if(current.length === 1) current = '0'; else current = current.slice(0,-1);
}

document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    if(btn.hasAttribute('data-number')){
      appendNumber(btn.textContent.trim());
      updateDisplay();
      return;
    }
    const action = btn.getAttribute('data-action');
    if(action === 'operator'){
      chooseOperator(btn.textContent.trim());
      updateDisplay();
      return;
    }
    if(action === 'equals'){
      compute(); updateDisplay(); return;
    }
    if(action === 'clear'){ clearAll(); updateDisplay(); return; }
    if(action === 'delete'){ deleteLast(); updateDisplay(); return; }
  });
});

// keyboard support
window.addEventListener('keydown', (e) => {
  if((/\d/).test(e.key)) appendNumber(e.key);
  if(e.key === '.') appendNumber('.');
  if(['+','-','*','/'].includes(e.key)) chooseOperator(e.key);
  if(e.key === 'Enter' || e.key === '=') { compute(); }
  if(e.key === 'Backspace') deleteLast();
  if(e.key === 'Escape') clearAll();
  updateDisplay();
});

updateDisplay();
