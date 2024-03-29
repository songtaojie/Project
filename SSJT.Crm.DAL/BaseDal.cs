﻿using SSJT.Crm.DBUtility;
using SSJT.Crm.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;

namespace SSJT.Crm.DAL
{
    public abstract class BaseDal<T> where T: class,new()
    {
        public  DbContext context = DbContextFactory.GetDbContext();
        /// <summary>
        /// 获取数据库中ID最大的一条数据
        /// </summary>
        /// <returns></returns>
        public T GetMaxModel()
        {
            T model = context.Set<T>().Max();
            return model;
        }
        /// <summary>
        /// 判断是否存在某条数据
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        public bool Exists(int id)
        {
            T model = context.Set<T>().Find(id);
            if (model != null)
                return true;
            return false;
        }
        /// <summary>
        /// 获取满足指定条件的数据
        /// </summary>
        /// <param name="lambdaWhere">获取数据的条件lambda</param>
        /// <returns></returns>
        public IEnumerable<T> LoadEntity(Expression<Func<T,bool>> lambdaWhere)
        {
            var result = context.Set<T>().Where(lambdaWhere);
            return result;
        }
        /// <summary>
        /// 分页形式的数据获取
        /// </summary>
        /// <typeparam name="S">在isAsc为false时，指定按什么类型的字段排序</typeparam>
        /// <param name="pageIndex">当前页码</param>
        /// <param name="pageSize">每页显示多少条数据</param>
        /// <param name="totalCount">输出参数，输出总共的条数，为了在页面分页栏显示</param>
        /// <param name="isAsc">true升序排序，false降序排序，false时需给出排序的lambda表达式</param>
        /// <param name="oederLambdaWhere">排序的lambda表达式</param>
        /// <param name="lambdaWhere">获取数据的lambda</param>
        /// <returns></returns>
        public IEnumerable<T> LoadPageEntities<S>(int pageIndex, int pageSize,out int totalCount, bool isAsc, Expression<Func<T, S>> oederLambdaWhere, Expression<Func<T, bool>> lambdaWhere)
        {
            var items = context.Set<T>().Where(lambdaWhere).Skip((pageIndex-1)*pageSize).Take(pageSize);
            totalCount = items.Count();
            if (isAsc)
            {
                return items;
            }
            else
            {
                return items.OrderByDescending(oederLambdaWhere);
            }
        }
        /// <summary>
        /// 添加一条数据
        /// </summary>
        /// <param name="model"></param>
        public void Add(T model)
        {
            context.Set<T>().Add(model);
        }
        /// <summary>
        /// 更新数据
        /// </summary>
        /// <param name="model"></param>
        public void Update(T model)
        {
            context.Entry<T>(model).State = EntityState.Modified;
        }
        /// <summary>
        /// 删除数据
        /// </summary>
        /// <param name="entity"></param>
        public void Delete(T entity)
        {
            context.Set<T>().Remove(entity);
        }
    }
}
