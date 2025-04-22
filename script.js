const MortgageCalculator = (() => {
    const inputs = document.querySelectorAll('input');
    const form = document.querySelector('form');
    const notations = document.querySelectorAll('.notation');
    const errorMsg = document.querySelectorAll('.error-msg');
    const clearBtn = document.querySelector('#clear-btn');
    const borders = document.querySelectorAll('.border');

    const reset = () => {
        errorMsg.forEach(msg => {
            msg.style.display = 'none';
        });

        inputs.forEach((input, index) => {
            borders[index].style.backgroundColor = 'var(--White)';
            input.value = '';
            if (notations[index]) {
                notations[index].style.backgroundColor = 'var(--Slate-100)';
                notations[index].style.color = 'var(--Slate-700)';
            }
            borders[index].style.borderColor = 'var(--Slate-300)';
            if (input.type === 'radio') {
                input.checked = false;
            }
        });
    }
    clearBtn.addEventListener('click', reset);

    const showError = (input, index) => {
        if (!errorMsg[index]) return;

        if (notations[index]) {
            notations[index].style.backgroundColor = 'var(--Red)';
            notations[index].style.color = 'var(--White)';
        }

        borders[index].style.borderColor = 'var(--Red)';

        if (input.validity.valueMissing) {
            errorMsg[index].style.display = 'block';
        }
        else if (input.validity.patternMismatch) {
            errorMsg[index].style.display = 'block';
            errorMsg[index].textContent = 'This field is not match pattern';
        }
    }

    const div = document.createElement('div');
    div.textContent = '';

    const updateResult = () => {
        const img = document.querySelector('.result img');
        const h3 = document.querySelector('.result h3');
        const para = document.querySelector('.result p');
        const result = document.querySelector('.result');
        const repayment = document.querySelector('#repayment');

        const amountDom = document.querySelector('#amount');
        const termDom = document.querySelector('#term');
        const interestRateDom = document.querySelector('#interestRate');

        let amount = parseFloat(amountDom.value);
        let term = parseFloat(termDom.value) * 12;
        let interestRate = parseFloat(interestRateDom.value) / (12 * 100);
        let repay = Calculate.repayment(amount, term, interestRate);
        let interestOnlyC = Calculate.interestOnly(amount, interestRate);

        result.style.textAlign = 'left';
        img.style.display = 'none';
        h3.textContent = 'Your results';
        para.textContent = `Your results are shown below based on the information you provided. To adjust the results, edit the form and click “calculate repayments” again. Your monthly repayments Total you'll repay over the term.`;
        para.style.margin = '10px 0 20px';

        div.innerHTML = `
            <div class='result-card'>
                <div>
                    <span>Your monthly repayments</span>
                    <p>$${(repayment.checked ? repay : interestOnlyC).toFixed(2)}</p>
                </div>
                <div>
                    <span>Total you'll repay over the term</span>
                    <p>$${Calculate.totalRepayment((repayment.checked ? repay : interestOnlyC), term).toFixed(2)}</p>
                </div>
            </div>
        `;
        result.appendChild(div);
    }

    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                borders[index].style.borderColor = 'var(--Lime)';
                if (errorMsg[index] && notations[index]) {
                    errorMsg[index].style.display = 'none';
                    notations[index].style.backgroundColor = 'var(--Lime)';
                    notations[index].style.color = 'var(--Slate-900)';
                }
            }
            else {
                showError(input, index);
            }
        })
    })

    const radios = document.querySelectorAll('input[type="radio"]');

    radios.forEach(() => {
        const firstRadioIndex = Array.from(inputs).findIndex(input => input.type === 'radio');
        
        radios.forEach((radio, index) => {
            radio.addEventListener('change', () => {
                radios.forEach((r, i) => {
                    borders[i + firstRadioIndex].style.borderColor = 'var(--Slate-300)';
                    borders[i + firstRadioIndex].style.backgroundColor = 'var(--White)';
                    r.style.backgroundColor = ''; 
                });
                
                radio.style.backgroundColor = 'var(--Lime)';
                borders[index + firstRadioIndex].style.borderColor = 'var(--Lime)';
                borders[index + firstRadioIndex].style.backgroundColor = 'hsl(61, 70%, 95%)';
                errorMsg[firstRadioIndex].style.display = 'none';
            });
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        inputs.forEach((input, index) => {
            if (!input.validity.valid) {
                showError(input, index);
            }
        })
        updateResult();
    })

    return {
        updateResult
    }
})();

MortgageCalculator;

const Calculate = (() => {
    const repayment = (amount, term, interestRate) => {
        return amount * (interestRate * (1 + interestRate) ** term) / ((1 + interestRate) ** term - 1);
    }

    const interestOnly = (amount, interestRate) => {
        return amount * interestRate
    }

    const totalRepayment = (repayment, term) => {
        return repayment * term
    }

    return {
        repayment, interestOnly, totalRepayment
    }
})();