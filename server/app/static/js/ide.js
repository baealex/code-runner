const randstr = (function() {
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	return function(length, charset) {
		var len = length || 32;
		var charset = charset || chars;
		var arr = [];
		for (var i = 0; i < len; i++)
			arr[i] = charset.charAt(Math.floor(Math.random() * charset.length));
		return arr.join('');
	};
})();

function loading(isStart) {
    if (isStart) {
        var number = 2;
        var squre = '';
        switch (number) {
            case 0:
                squre = 'dot-revolution';
                break;
            case 1:
                squre = 'dot-pulse';
                break;
            case 2:
                squre = 'dot-bricks';
                break;
        }
        $('#loading').html(`<div style="position: fixed; top: 0; left: 0; width: 100vw; heigth: 100vh; background-color: rgba(255, 255, 255, 0.90); z-index: 9999;"><div style="margin: 48vh auto;" class="${squre}"></div></div>`);
    }
    else
        $('#loading').html('');
}

const IDE = (function() {
	const makeResult = function(element) {
		return element.result.replace(/\n/g, '<br />') + '<br />Run Time : '+ element.time;
	}

	const intt = randstr(20);
	let code = undefined;
	let result = undefined;
	try {
		code = localStorage.getItem('code');
		result = JSON.parse(localStorage.getItem('result'));

		$('#source').val(code)
		$('#result')[0].innerHTML = makeResult(result)
	} catch {
		code = undefined;
		result = undefined;
		localStorage.clear();
	}

	var editor = CodeMirror.fromTextArea(document.getElementById('source'), {
		lineNumbers: true,
		theme: 'material-darker',
		textWrapping: true,
		mode: 'javascript',
		indentUnit: 4,
	});

	const saveState = function(code, result) {
		localStorage.setItem('code', code);
		localStorage.setItem('result', JSON.stringify(result));
	}

	const run = function(type) {
        const source = editor.getValue();
        loading(true);
		$.ajax({
			url: '/run/'+ type +'?intt=' + intt,
			type: 'POST',
			data: {
				source: source
			}
		}).done(function(data) {
			$('#result')[0].innerHTML = makeResult(data);
            saveState(source, data);
            loading(false);
		});
    }
    
    const saveCode = function() {
        loading(true);
        const source = editor.getValue();
        $.ajax({
            url: '/save',
            type: 'POST',
            data: {
                intt: intt,
                type: 'py3',
                source: source,
            }
        }).done(function(data) {
            loading(false);
            console.log(data);
        });
    }

	return {
		c: function() {
			run('c');
		},
		cpp: function() {
			run('cpp');
		},
		rs: function() {
			run('rs');
		},
		py3: function() {
			run('py3');
		},
		js: function() {
			run('js');
        },
        ts: function() {
			run('ts');
        },
        save: function() {
            saveCode();
        }
	}
})();