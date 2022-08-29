## Priority Queue

implements Comparable<T>
queue를 직접 생성할수있는데 우선순위를 가지는 큐를 생성해줄수있다
@Override
public int compareTo(){
return this.~ - or ~ -this.
}
=> collections.sort();

Comparator<> comparator = new Comparator<>(){
@Override
public int compare(a,b){
return a-b or b-a
}
}
직접비교
collections.sort(a,b배열 , comparator);

---

stack : peek(), pop(), push(Object o), int search(Object o) 찾으면 위치, 못찾으면 -1
Stack st = new Stack();

queue : offer(), poll(), peek()
Queue q = new LinkedList();
