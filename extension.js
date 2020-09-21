const vscode = require('vscode')
const pangu = require('pangu')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // 插件激活时执行

    console.log('Congratulations, your extension "halfwidth-forms-converter" is now active!')

    let disposable = vscode.commands.registerCommand('convert_to_half.convert', function () {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
            return
        } // No open text editor

        const document = editor.document
        const selection = editor.selection
        const selectedText = document.getText(selection)

        // just spacing selected text if has
        if (selectedText) {
            editor.edit((builder) => {
                let panguText = pangu.spacing(selectedText)
                panguText = panguText.replace(/，/g, ', ')
                panguText = panguText.replace(/。/g, '. ')
                panguText = panguText.replace(/：/g, ': ')
                panguText = panguText.replace(/？/g, '? ')
                panguText = panguText.replace(/；/g, '; ')
                panguText = panguText.replace(/、/g, ', ')
                panguText = panguText.replace(/（/g, ' (')
                panguText = panguText.replace(/）/g, ') ')

                builder.replace(selection, panguText)
            })
        } else {
            const lineCount = document.lineCount

            editor.edit((builder) => {
                for (let i = 0; i < lineCount; i++) {
                    const textLine = document.lineAt(i)
                    const oriTrimText = textLine.text.trimRight()

                    if (oriTrimText.length === 0) {
                        builder.replace(textLine.range, '')
                    } else {
                        let panguText = pangu.spacing(oriTrimText)
                        panguText = panguText.replace(/，/g, ', ')
                        panguText = panguText.replace(/。/g, '. ')
                        panguText = panguText.replace(/：/g, ': ')
                        panguText = panguText.replace(/？/g, '? ')
                        panguText = panguText.replace(/；/g, '; ')
                        panguText = panguText.replace(/、/g, ', ')
                        panguText = panguText.replace(/（/g, ' (')
                        panguText = panguText.replace(/）/g, ') ')

                        builder.replace(textLine.range, panguText)
                    }
                }
            })
        }
        vscode.commands.executeCommand('editor.action.trimTrailingWhitespace')
    })
    context.subscriptions.push(disposable)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
}
