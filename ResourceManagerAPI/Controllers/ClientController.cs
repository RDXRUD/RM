using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResourceManagerAPI.DBContext;
using ResourceManagerAPI.IRepository;
using ResourceManagerAPI.Models;
using System.Globalization;

namespace ResourceManagerAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IAccount _account;
        private readonly PGDBContext _dbContext;
        public ClientController(IAccount account, PGDBContext context)
        {
            _account = account;
            _dbContext = context;
        }

        [HttpGet, Authorize]
        [Route("Clients")]
        public async Task<IEnumerable<Client>> GetClients()
        {
            try
            {
                return  _dbContext.client_master.OrderBy(client => client.client_id).ToList();
            }
            catch (Exception ex)
            {
                return (IEnumerable<Client>)StatusCode(500, ex.Message);
            }
        }

        [HttpGet, Authorize]
        [Route("ActiveClients")]
        public async Task<IEnumerable<Client>> GetActiveClients()
        {
            try
            {
                return _dbContext.client_master.Where(c=>c.status=="ACTIVE").OrderBy(client => client.client_id).ToList();
            }
            catch (Exception ex)
            {
                return (IEnumerable<Client>)StatusCode(500, ex.Message);
            }
        }

        [HttpPost, Authorize]
        [Route("AddClient")]
        public IActionResult AddClient(Client newClient)
        {
            
            try
            {
                if (newClient == null || newClient.client_name == null || newClient.partner_incharge == null)
                {
                    return StatusCode(501, "Client name or Partner incharge can't be null");
                }
                var testName = _dbContext.client_master.Where(c => (c.client_name.ToUpper()) == newClient.client_name.ToUpper().Trim()).FirstOrDefault();
                if (testName != null)
                {
                    return StatusCode(501, "Client Name already exist");
                }
                newClient.client_name = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(newClient.client_name);//Formatting Client Name
                newClient.status = "ACTIVE";

                _dbContext.client_master.Add(newClient);
                _dbContext.SaveChanges();
                return Ok(newClient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPut, Authorize]
        [Route("UpdateClient/{id}")]
        public async Task<IActionResult> UpdateClient(int id, [FromBody] Client updatedClient)
        {
            
            try
            {
                if (updatedClient == null)
                {
                    return BadRequest("Client data is null.");
                }

                var existingClient = await _dbContext.client_master.FindAsync(id);
                if (existingClient == null)
                {
                    return NotFound($"Client with ID {id} not found.");
                }
                if (existingClient.status == "INACTIVE")
                {
                    return StatusCode(502, "Can't Edit INACTIVE Client");
                }
                var testName =  _dbContext.client_master.Where(c => (c.client_name.ToUpper()) == updatedClient.client_name.ToUpper().Trim() && updatedClient.client_name.ToUpper().Trim() != existingClient.client_name.ToUpper()).FirstOrDefault();
                if (testName != null)
                {
                    return StatusCode(501, "Name already exist");
                }
                else
                {
                    existingClient.client_name= CultureInfo.CurrentCulture.TextInfo.ToTitleCase(updatedClient.client_name);
                }

                existingClient.partner_incharge = updatedClient.partner_incharge;
                existingClient.status = updatedClient.status;

                await _dbContext.SaveChangesAsync();

                return Ok(existingClient);
            }

            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while updating client details.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut, Authorize]
        [Route("UpdateStatus/{id}")]
        
        public async Task<IActionResult> UpdateStatus(int id)
        {
            try
            {

                var existingClient = await _dbContext.client_master.FindAsync(id);

                if (existingClient == null)
                {
                    return NotFound($"Client with ID {id} not found.");
                }
                if(existingClient.status == "ACTIVE")
                {
                    existingClient.status = "INACTIVE";
                }
                else
                {
                    existingClient.status = "ACTIVE";
                }

                await _dbContext.SaveChangesAsync();
                return Ok(existingClient);
            }

            catch (DbUpdateException ex)
            {
                return StatusCode(500, "An error occurred while updating employee details.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
