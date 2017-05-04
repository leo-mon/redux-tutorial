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

## Writing a Counter Reducer with Tests
> 超速ライブコーディンク、すげー

最初に作るのはReducer、前の状態とActionを受け取り、次の状態を返す関数
```javascript
function counter(state, action) {
  return state;
}
```

みたいな。ただその前にテストコードを書いておく  

- `src/app.js`　へ記述していく
- webpackを起動しておき`node dist/app.js`でテスト実行

> あとは動画に沿って付け足し

慣例としてstateに`undefined`を受け取った場合reduxは初期状態を返さなくてはならない  
switch-caseとES6のデフォルト引数の導入（見栄えがいいため）


## Store Methods: getState(), dispatch(), and subscribe()
- `dist/index.htmlを追加`
- Redux(の中のcreateStore)をimport

StoreがReduxの3つの原則をひとまとめにする…全ての状態を保持し、ActionをDispatchする。作成の際、アップデート方法を伝えるためにReducerを指定する  

Storeには3つ重要なメソッドがある
- `getState()`: その時点の状態
- `dispatch()`: 指定したActionを実行
- `subscribe()`: dispatchされるたびにコールされる関数を指定

subscribeのコールバックの中でinnerTextを呼んでるため初期値が表示されない  
ここをrender()を定義し外出しする

## Implementing Store from Scratch
理解のために`createStore()`メソッドを手で作る  

> 爆速コーディング。。。。


## React Counter example
DOMを直接いじるのはスケールしないので、`render()` で表現していた部分をReactへ
> 向こうでもDOMはドムの様だ

`Counter` コンポーネント（Reactコンポーネント）へReduxとの依存関係をハードコードはせず、コールする際にpropsとして渡す

まとめなおすと
`Counter`コンポーネント: dumpコンポーネントと呼称、ビジネスロジックは含まない  
アプリケーションの状態とレンダリング可能な出力と、どうコールバックがpropsを通じて渡され、イベントハンドラと結びつけられるか、のみが定義される

`render`メソッド: Counterを呼び出し、現在の状態をstoreから渡す、dispatchされるactionも。storeが更新されるたびにrenderが呼ばれるため、Counterは常に最新の値を保持し続ける
