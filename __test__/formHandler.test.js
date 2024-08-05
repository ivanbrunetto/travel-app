const { handleSubmit } = require('../src/client/js/formHandler');
const { fetchEvaluate } = require('../src/client/js/fetchEvaluate');

jest.mock('../src/client/js/fetchEvaluate');

document.body.innerHTML = `   

            <form id="urlForm">
                    <input id="name" type="text" name="url">
                    <button id="submitButton" type="submit">Submit</button>
            </form>
            <div id="results"></div>
            `;



function makeOutput(output) {
      return `
        <p>
            Polarity: ${output.data.score_tag} <br>
            Subjectivity: ${output.data.subjectivity} <br>
            Irony: ${output.data.ironiy} <br>
            Confidence: ${output.data.confidence} <br>
        </p>
    `;
}

test("Testing the handleSubmit() function", () => {
      const resp = {
            data: {
                  score_tag: 'PI',
                  subjectivity: 'SUBJECTIVE',
                  ironiy: 'NONIRONIC',
                  confidence: '100'
            }
      };

      const empty = {
            data: {
                  score_tag: '-',
                  subjectivity: '-',
                  ironiy: '-',
                  confidence: '-'
            }
      };

      
      fetchEvaluate.mockResolvedValue(resp);  
      
      handleSubmit(new Event('click'));
      expect(document.getElementById('results').innerHTML).toBe(makeOutput(empty));
      fetchEvaluate().then(() => {
            expect(document.getElementById('results').innerHTML).toBe(makeOutput(resp));
      })
      
});


test("Testing the handleSubmit() function with error", () => {
      const resp = {
            error: 1,
            message: 'message1'
      };

      const empty = {
            data: {
                  score_tag: '-',
                  subjectivity: '-',
                  ironiy: '-',
                  confidence: '-'
            }
      };

      
      fetchEvaluate.mockResolvedValue(resp);  
      
      const mockAlert = jest.fn();
      window.alert = mockAlert;

      handleSubmit(new Event('click'));
      expect(document.getElementById('results').innerHTML).toBe(makeOutput(empty));
      fetchEvaluate().then(() => {
            expect(document.getElementById('results').innerHTML).toBe(makeOutput(empty));
            expect(mockAlert.mock.calls[0][0]).toBe(resp.message);
      })
      
});
