// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const pangu = require('pangu')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // 插件激活时执行

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "halfwidth-forms-converter" is now active!')

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
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
                let panguText = pangu.spacing(selectedText).replace('。', '.')
                panguText = panguText.replace('，', ',')
                panguText = panguText.replace('。', '.')
                panguText = panguText.replace('：', ':')
                panguText = panguText.replace('？', '?')
                panguText = panguText.replace('；', ';')
                panguText = panguText.replace('、', ',')
                panguText = panguText.replace('（', '(')
                panguText = panguText.replace('）', ')')

                builder.replace(selection, panguText)
            })
            return
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
                        panguText = panguText.replace('，', ',')
                        panguText = panguText.replace('。', '.')
                        panguText = panguText.replace('：', ':')
                        panguText = panguText.replace('？', '?')
                        panguText = panguText.replace('；', ';')
                        panguText = panguText.replace('、', ',')
                        panguText = panguText.replace('（', '(')
                        panguText = panguText.replace('）', ')')

                        builder.replace(textLine.range, panguText)
                    }
                }
            })
        }
    })
    // vscode.commands.executeCommand('editor.action.trimTrailingWhitespace')
    context.subscriptions.push(disposable)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
}
