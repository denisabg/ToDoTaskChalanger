﻿using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ToDoTasks.Interfaces;
using ToDoTasks.Models;
using ToDoTasks.Services;

namespace ToDoTasks.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class TasksController : ControllerBase
    {

        private readonly ILogger<TasksController> _logger;
        private readonly ITaskToDoService _service;

        //public TasksController()
        //{
        //    this._service = ServiceFactory.Create();
        //}

        public TasksController(ILogger<TasksController> logger)
        {
            _logger = logger;
            _service = ServiceFactory.Create();
        }


        // GET: api/Tasks
        [HttpGet]
        public async Task<IEnumerable<ToDoTask>> Get()
        {

            try
            {
                return await _service.GetAsync(User.Identity.Name);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }

            return new List<ToDoTask>();
            
        }


        // POST: api/Tasks
        [HttpPost]
        public async Task<ToDoTask> Post([FromBody]ToDoTask value)
        {
            try
            {

                await _service.SendAsync(value);
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
            }
            //Return id or object 
            return value;
        }


    }
}