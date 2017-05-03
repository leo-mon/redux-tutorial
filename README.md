# redux-tutorial

[Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)を見ながらさらう


## 環境設定 & 起動コマンド
http://qiita.com/insight3110/items/4d212ecef6992e8eaee5 を参考

```
yarn init -y
yarn add --dev babel babel-cli babel-loader babel-preset-es2015 babel-preset-react expect react react-dom react-redux redux webpack
```

`.babelrc`と`webpack.config.js`を追加&修正

```
mkdir src dist
```

### webpack起動
```
webpack -w
```

## THe Single Immutable State Tree
1つめの原則: 簡単なものから複雑なものまで全ての状態(データからUIの状態まで)を一つのJSオブジェクトとして保持するのがRedux

宣言的に記述されるので遷移をトラックできる
例: カウンタの数字がJSのnumberで保持されたり、複数ある場合はリストで保持される  
もっと複雑な場合はオブジェクトに(JSON)

これをStateとか、State Treeと呼ぶ  
