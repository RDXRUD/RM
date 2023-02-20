using System;
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ResourceManagerAPI.Models
{
    public partial class EmployeeDBContext : DbContext
    {
        public EmployeeDBContext(DbContextOptions<EmployeeDBContext> options)
            : base(options)
        {

        }

        public virtual DbSet<Employee> employee { get; set; } = null!;
        public virtual DbSet<Skills> skill { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>(entity =>
            {

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.EmailAddress)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                //  entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
                entity.Property(e => e.TaskName)
                      .HasMaxLength(250)
                      .IsUnicode(false);
                entity.Property(e => e.Start)
                    .HasMaxLength(250)
                    .IsUnicode(false);
                entity.Property(e => e.Finish)
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

        public static implicit operator List<object>(EmployeeDBContext v)
        {
            throw new NotImplementedException();
        }
    }
}