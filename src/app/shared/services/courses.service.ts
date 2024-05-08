import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CourseType } from '@shared/models/interface/course.interface';
import { PaginatorType } from '@shared/models/interface/paginator.interface';
import { userDetailsSelect } from '@shared/store/reducers/user-details.reducer';

import { map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Environment as env } from '../../../environments/environment';

const BASE_URL = env.base_url;
const API_KEY = env.token;

const HEADER = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    Authorization: API_KEY
  })
};

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private httpClient = inject(HttpClient);
  private store = inject(Store);

  getAllCourses(): Observable<CourseType[]> {
    return this.httpClient
      .get<CourseType[]>(`${BASE_URL}/curso/status/1`, HEADER)
      .pipe(
        map(course =>
          course.filter(res => {
            let result;
            if (!this.hasUserLogged || this.isPartner) {
              result = res;
            } else if (!this.isPartner) {
              result = res;
            }
            return result;
          })
        )
      );
  }

  searchCourse(search: string): Observable<CourseType[]> {
    return this.httpClient
      .get<CourseType[]>(`${BASE_URL}/curso/search?nome=${search}`, HEADER)
      .pipe(map(course => course.filter(res => this.hasLawCourses(res))));
  }

  getCourseByCategory(id: number | string): Observable<CourseType[]> {
    return this.httpClient
      .get<CourseType[]>(`${BASE_URL}/curso/categoria/${id}`, HEADER)
      .pipe(map(course => course.filter(res => this.hasLawCourses(res))));
  }

  getCourseBySubCategory(id: number | string): Observable<CourseType[]> {
    return this.httpClient
      .get<CourseType[]>(`${BASE_URL}/curso/subcategoria/${id}`, HEADER)
      .pipe(map(course => course.filter(res => this.hasLawCourses(res))));
  }

  getCourseById(id: number | string): Observable<CourseType> {
    return this.httpClient.get<CourseType>(`${BASE_URL}/curso/${id}`, HEADER);
  }

  getCourseByPagination(page: PaginatorType): Observable<CourseType[]> {
    const { indexPage, pageSize } = page;

    return this.httpClient
      .get<CourseType[]>(
        `${BASE_URL}/curso/pagination?page=${indexPage}&size=${pageSize}`,
        HEADER
      )
      .pipe(map(course => course.filter(res => this.hasLawCourses(res))));
  }

  get isPartner(): boolean {
    let hasPartner = false;
    this.store.select(userDetailsSelect).subscribe({
      next: user =>
        user.map(details => {
          hasPartner = details.parceiro ? true : false;
        })
    });

    return hasPartner;
  }

  get hasUserLogged(): boolean {
    let hasLogged = false;
    this.store.select(userDetailsSelect).subscribe({
      next: user =>
        user.map(details => {
          hasLogged = details.email ? true : false;
        })
    });

    return hasLogged;
  }

  hasLawCourses(course: CourseType): CourseType {
    let result: any;
    if (course.status === 1 && (this.isPartner || !this.hasUserLogged)) {
      result = course;
    } else if (course.status === 1 && !this.isPartner) {
      result = course;
    }
    return result;
  }
}
