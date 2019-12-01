import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Post } from '../models/post.model';

const BACKEND_URL = environment.apiURL + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
    .pipe(map((postData) => {
      return { posts: postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          city: post.city,
          country: post.country,
          productName: post.productName,
          fromPrice: post.fromPrice,
          externalLink: post.externalLink,
          creator: post.creator
        };
      }), maxPosts: postData.maxPosts };
    }))
    .subscribe((transformedPostData) => {
      this.posts = transformedPostData.posts;
      this.postsUpdated.next({
        posts: [...this.posts],
        postCount: transformedPostData.maxPosts
      });
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      city: string,
      country: string,
      productName: string,
      fromPrice: number,
      externalLink: string,
      creator: string
    }>(BACKEND_URL + id);
  }

  addPost(
    title: string,
    content: string,
    image: File,
    city: string,
    country: string,
    productName: string,
    fromPrice: number,
    externalLink: string
  ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    postData.append('city', city);
    postData.append('country', country);
    postData.append('productName', productName);
    postData.append('fromPrice', fromPrice.toString());
    postData.append('externalLink', externalLink);
    this.http.post<{message: string, post: Post}>(BACKEND_URL, postData)
    .subscribe((responseData) => {
      this.router.navigate(['/']);
    });
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string,
    city: string,
    country: string,
    productName: string,
    fromPrice: number,
    externalLink: string
    ) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
      postData.append('city', city);
      postData.append('country', country);
      postData.append('productName', productName);
      postData.append('fromPrice', fromPrice.toString());
      postData.append('externalLink', externalLink);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        city,
        country,
        productName,
        fromPrice,
        externalLink,
        creator: null
      }
    }
    this.http.patch(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
