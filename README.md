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


## Avoiding Array Mutations with concat(), slice(), and ...spread
状態の管理にアレイを使う場合、もとのアレイを変更しない様に気をつける必要がある
> Pythonのせいでリストとこれまで書いてたけどまあ雰囲気でわかるからよし
```
yarn add --dev deep-freeze  # オブジェクトを不変にするライブラリ
```

> ひとまずmulticounters.jsへ分割してそこへ記述、それに伴いWebpackの設定も変更

`concat()`, `slice()`, `...`:スプレッド演算子を活用して元のアレイを変更しない様にして扱っていく

## Avoiding Object Mutations with Object.assign() and ...spread
今度はオブジェクトを利用する際について、基本は前節と一緒

> こちらもひとまず`todo.js`を作成して検証
> ...の利用はまだfixされていない模様
```
yarn add --dev babel-plugin-transform-object-rest-spread
```
> したあと.bablercへプラグイン追加するとトランスコンパイルしてくれる


## Writing a Todo List Reducer (Adding a Todo)
> 引き続き`todo.js`へ追記していく方向で（toggleTodoは参考に残しておく...おそらくこの後Reducerに実装されるだおうけど
> 前節を参考にReducerを実装していく、特筆すべき点はなし


## Writing a Todo List Reducer (Toggling a Todo)
actionに与えられているidを選択する必要がある->map関数を利用
> mapって直接値いじらないのね、勉強
> testToggleTodoは中身書き換え

## Reducer Composition with Arrays
前節までの2つのAction
AddTodo: 新しく追加...Arrayの変更
TaggleTodo: 既存の変更...個々の要素の変更
現在Arrayをどう変更するかと、個々のTodoをどう変更するかが1つのReducerの中にある状態  
これの分割もReduxは簡単にできる
todos -> todoへの移設

いじるState Tree が違う場合そのレベルごとにReducerを分割して上から呼ぶ様にする（Reducer Composition）
こうすることでアプリケーションが複雑になってきた時管理しやすくなる（意訳

## Reducer Composition with Objects
> のっけからconsole.logの嵐: 動作がこれでわかる

より多くの情報を詰め込みたい場合: 他にもReducerを定義して、これらを子要素にもつ親Reducerを作成する(時間ないので意訳)

> actionは全要素に伝わる: 定義されてない時は要素をそのまま返す必要がある、というわけか...

> state: 'SHOW_ALL'と宣言してしまい詰まってしまった, state = が正解

## Reducer Composition with combineReducers()
前節の様に独立したReducerを異なるStateTreeへ作用させ、合体させる手法はよく取られる。  
そのためこのメソッドがReduxから提供されている。（`combineReducers`）  　　
todoAppをこれを用いて書き直す


## Implementing combineReducers() from Scratch
combineReducers()をスクラッチでインプリして見る

- `Object.keys()`メソッド: アレイのキーを順に並べて返す
  ```javascript
  var arr = ['a', 'b', 'c'];
  console.log(Object.keys(arr)); // console: ['0', '1', '2']

  // array like object
  var obj = { 0: 'a', 1: 'b', 2: 'c' };
  console.log(Object.keys(obj)); // console: ['0', '1', '2']
  ```

- `reduce()`メソッド: 隣り合う2つの要素に左から順に関数を適用する
  ```javascript
  [0,1,2,3,4].reduce(function(previousValue, currentValue, index, array){
    return previousValue + currentValue;
  });
  /*
  最初はpreviouseVulue:0, currentValue:1. 0+1=1が次のpreviouseVulue.
  2回目はpreviouseVulue:1, currentValue:2 . 1+2=3が次のpreviouseVulue.
  ...
  最終的に全ての合計値10が返る.
  */
  ```

  https://stackoverflow.com/questions/15748656/javascript-reduce-on-object　がわかりやすい  
  best answerの例の、初期値0を外すと結果がa23になる  
  今回は初期値に{}を指定して、keyをインクリメントして行くように振舞わせてる  


## React Todo List Example (Adding a Todo)
React を用いたブラウザでのADD_TODOの描画

> todo.htmlを作成してそこで作業

> refを使うと直接コンポーネントを触りに行ける
  今回はnodeという名前をinputに付与してアクセスしている（と思う）
> あとはソースコードコメント参照、これまでのテスト類はコメントアウト

## React Todo List Example (Toggling a Todo)
前節同様こんどはTOGGLE_TODOの描画実装

> 素直、こちらもソースコード読めばわかる

## React Todo List Example (Filtering Todos)
Todoについて、すべて、完了したもの、未完了なものの表示をvisiblityFilterを利用して出し分ける

> だいぶ追加。childrenの使い方に注意。

## Extracting Presentational Components (Todo, TodoList)
TodoAppコンポーネントが巨大に
分割して複数人で作業できるようコンポーネントは分けるべきなのでリファクタ  

ToDoをまず分離
- keyを削除、それぞれ別々のコンポーネントとして描画されるためkeyは要らなくなる
- それぞれのコンポーネントを柔軟で合理的にするために、何の動作も記述されていないコンポーネントをたくさん作る方針で行く...どのように見えどのようにrenderされるかが重要なため.
このようなコンポーネントを`representational component`と呼ぶ.
そうするためにonClickをPropとして親から渡していくようにする

これらに挙動を渡すトップレベルのTodoAppコンポーネントがContainer Componentに今回はなる.
ここでTodoListを呼ぶ時Dispatchを渡す.

> タイトル的にrepresentational ではなく presentational かもしれない

## Extracting Presentational Components (AddTodo, Footer, FilterLink)
別の部分も細かいコンポーネントへ分割していく

> 構造整理

```
TodoApp: コンテナコンポーネント、store.dispatch()はここから子へと渡していく
  ├ AddTodo
  ├ TodoList
    ├ Todo
  ├ Footer
    ├ FilterLink
```

AddTodo
クリックされたらonAddClickをコール、入力された値を渡す
onAddClickはTodoAppから渡されている、入力された値でADD_TODOをdispatch
ADD_TODOはそれまでの値と結合された値を結合して返す（ここがreducer）

TodoList
表示部分、TodoAppでのstore.getState()で手に入れたreduxからの値を表示等々
onTodoClickでcompletedを変化させる、これもTodoAppから渡す、completedを反転する

Footer
見えるフィルタの表示や変更

> この辺りでWebpack dev server導入

## Extracting Container Components (FilterLink)

前節までのアプローチは中間コンポーネントに必要がない情報が渡ってしまいコードが複雑に
例えばFliterlinkはcurrentfilterを必要とするがそのためにFooterでvisibilityFilterをTodoAppから受けとり渡す必要がある。
今回はFooterをリファクタ、どちらの要素(filterの値やonClickへと渡していく関数)もいらないので削除してrootコンポーネントとして置くのに止める
FilterLinkをContainer、Linkをpresentationalとして再構成
しかしstore.subscribe()に何も登録しておらず、storeを変更しても再描画されない可能性が生じる
（現在はStoreが変更されると全コンポーネントに再描画が走るようにしているため変更されるがそれは非効率）
そのためReactの描画のライフサイクル（componentDidMount, componentWillUnmountß）を利用して強制的に再描画を走らせるようにする。

## Extracting Container Components (VisibleTodoList, AddTodo)
前節のような分離は、データフローを少し複雑にするが、FilterLinkを追加のデータを考慮せずに他のコンポーネント内で使えるようにすることができる

同様にTodoListをPresentationalに保ったまま、TodoAppから分離させる  
ContainerとしてVisibleTodoを用意しそこでreduxと通信、PresentationalであるTodoListへと渡す

Add TodoはContainerとPresentationalな部分が混在しているが、十分シンプルかつ今後追加されるようなものでもないのでそのままにする



このような分離をドグマとしてとらえてはいけない、コードの複雑さが解消される時のみで十分  
一般的には、最初にPresentationalなコンポーネントを分離して、単にpropsを中継するだけのコンポーネントが増えて来たら、コンテナを作成してデータを渡すようにする


## Passing the Store Down Explicitly via Props
これまでは`store`をグローバル変数で宣言しておいてそれを各Container内で呼んでいたが、これにはいくつか問題点がある

- テストがしづらい（テストケースによっては異なるStoreを与えたくなる）
- サーバーでの複製が非常にしづらい: リクエストはそれぞれ異なるデータを要求するため、store のインスタンスは全てのリクエストに個別に割り振りたい

ただしどのコンポーネントもStoreとのやり取りは行う必要があるため、propsとして渡すのが一手となる（不便であるため解消法は次節以降で解説）

```
{store} = this.props  // ES6の記法
```

> AddTodoで不要なonAddClickを渡していたのを消し忘れていたので削除(Extracting Presentational Componentsでおそらく消していた手筈）

## Passing the Store Down Implicitly via Context
PresentatioalコンポーネントにもStoreとやりとりさせなければならない、という点で前節は煩雑になる  
違うやり方としてReact のContextを利用する方法がある

Provider を定義し、それでTodoAppを包むことで、Propsを孫コンポーネントにまで届けることができる
ただしこれにはChildContextTypesで何を渡していくかを定義する必要あり

受け取るコンポーネント側ではpropsの代わりにcontextを利用すりればよい　 
ただしこちらもcontextTypeで受け取る値を指定してやる必要あり

中間コンポーネントを飛ばすワームホールのように働く  
どの階層にも届くために、FooterではContexttypeを定義していない  

Contextは強力だがReactの明示的なデータフローにはそぐわない
グローバル変数をどこでも使えるようにしてしまうが、このように依存性の注入以外に用いるべきではない

またContext APIはFixされていないので変更の恐れがあることも注意するべき

> 実際v16以降はPropTypeへのアクセスはdepricateになった模様


## Passing the Store Down with <Provider> from React Redux
Providerは自分で定義する必要はなく、react-reduxをインストールして使えば良い


## Generating Containers with connect() from React Redux (VisibleTodoList)

propsへと与えられる値について、関数として外だし

- mapStateToProps: 状態として渡すPropsを返す関数
- mapDispatchToProps: アクションを指定したdispatchを返す関数

これらを`connect`メソッドでつなげる、第一引数にmapStateToProps, 第二引数にmapDispatchToProps  
一旦関数を閉じて再度開き、このPropsが渡される対象(TodoList)を引数に取るようにする

こうすることでVisibleTodoはPropTypeの宣言などを省略化した状態のコンテナコンポーネントとして書くことができる


## Generating Containers with connect() from React Redux (AddTodo)
ファイル分けを適切に行って入ればmap...ToProps()はそのままの名称でいいが今回は1ファイルのため名前を変更しておく
AddTodoでも同様にconnectを使ってStoreとやりとりをできるようにする

> AddTodoはContainerでありPresentationalでもあるため、connectで自身でをラップして自身でStoreを受け取れるようにする

connectは第二引数に何も渡さないとdispatchを自動で渡す

## Generating Containers with connect() from React Redux (FooterLink)
Containerコンポーネントが自身の持つPropsをconnectorを通じて注入したいときはmapStateToProps, mapDispatchToPropsともに第二引数で渡すことができる(わかりやすくするためownPropsと名付ける)  

> 警告も出なくなるので基本connect()を使ってStoreの情報を注入は行った方が良さげ

## Extracting Action Creators
actionがローカルで宣言されていると、例えば他のコンポーネントでAddTodoをdispatchしたいときに不便  

そこでaddTodoなどのdispatchされるactionを返すような関数を書いて一箇所にまとめておくことで、他の人がどのようなActionがあるのかを俯瞰しやすくする
