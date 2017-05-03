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

## The Single Immutable State Tree
1つめの原則: 簡単なものから複雑なものまで全ての状態(データからUIの状態まで)を一つのJSオブジェクトとして保持するのがRedux

宣言的に記述されるので遷移をトラックできる
例: カウンタの数字がJSのnumberで保持されたり、複数ある場合はリストで保持される  
もっと複雑な場合はオブジェクトに(JSON)

これをStateとか、State Treeと呼ぶ  

## Describing State Changes with Actions
2つめの原則: State TreeはRead Only  

状態を変えたい時はActionをDispatchする  
Actionは変更を記述したプレーンなJSオブジェクト

中身は自由だが1つ、typeプロパティを記述する必要がある  
この例のように複数カウンタがある場合はindexプロパティをつけて区別する

このやりかたはよくスケールする…コンポーネントは何が起こるかを持たず、単に適切なプロパティをつけてActionをDispatchするだけ  

## Pure and Impure Functions
この2つの区別をつけておくことは重要
Pure Functionは引数に応じて値を返すのみ、副作用なし…つまりNWやDBコールを持たない
また与えられた引数自体をいじらない（上書きしない）

これから書くうちのいくつかはPure Functionである必要がある


## The Reducer Function
アプリケーションの状態を示すPure functionとして記述されるのが、UIやViewのレイヤはもっとも見通しが良い、というアプローチを最近のJSフレームワークは取っている  
Reduxはこのアプローチを別の側面から補足する...  
状態の変更は
- 前の状態
- DispathcされるだろうAction
- 次の状態
をとるPure functionによって宣言される必要がある

アプリケーション内にひとつ特定のFunctionがあり、それがアプリケーション全ての状態と、DispatchされているActionをとって、次の状態を返す
この関数はPureである必要がある…上書きをせず、新しいオブジェクトを返す

複雑なアプリケーションでも同様、一つの関数が前の状態とDispatchされるだろうActionから、計算された次の状態を管理する…  

値がそのままの見た目の変更、など早い方がいいものも前の状態から値を引き継げる  
これによりReduxは早い

これが3つの（最後の）原則:
状態を変更するにはそのための関数を書く必要があり、それは前の状態、DispatchされるAction、次の状態を持つPure Functionでなければならない
この関数のことを**Reducer**と呼ぶ
